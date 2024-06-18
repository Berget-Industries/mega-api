import { IAction } from "../../../models/Message.ts";
import AlexMemory from "../../../models/AlexMemory.ts";
import TokenCounter from "../../../utils/tokenCounter.ts";
import { ChatOpenAI } from "npm:@langchain/openai@0.0.29";
import { getPluginConfig, getAlexPlugins } from "../../../utils/getPluginConfig.ts";
import { BufferMemory } from "npm:langchain/memory";
import { StructuredTool } from "npm:langchain/tools";

import { AgentExecutor, createOpenAIFunctionsAgent } from "npm:langchain@latest/agents";
import { BaseChatModel } from "npm:@langchain/core/language_models/chat_models";
import { BaseFunctionCallOptions } from "npm:@langchain/core/language_models/base";
import { BaseMessageChunk } from "npm:@langchain/core/messages";

import { getPrompt } from "./prompts.ts";
import { MongoDBChatMessageHistory } from "npm:@langchain/mongodb";
import { Collection } from "npm:mongodb";

import {
	ActionCounterCallbackHandler,
	TokenCounterCallbackHandler,
	LoggerCallbackHandler,
} from "../../callbackHandlers/index.ts";

// REGULAR TOOLS
import { initPluginKnowledge } from "./tools/knowledgeTool.ts";
import getCurrentDateAndTimeTool from "./tools/getCurrentDateAndTime.ts";

// PLUGIN TOOLS
import initPluginWaiterAid from "./tools/plugins/waiteraid/index.ts";
import { initPluginMailESendToHuman } from "./tools/plugins/mailE/index.ts";
import { initPluginGSuiteCalendarEvent } from "./tools/plugins/gSuite/index.ts";

const createTools = async ({
	agentName,
	organizationId,
	conversationId,
	organizationPlugins,
}: {
	agentName: string;
	organizationPlugins: string[];
	organizationId: string;
	conversationId: string;
}): Promise<StructuredTool[]> => {
	type availablePlugins = "mega-assistant-alex-mailE-sendToHuman" | undefined;
	const availablePlugins = {
		// waiteraid: initPluginWaiterAid,
		"mega-assistant-alex-mailE-sendToHuman": initPluginMailESendToHuman,
		"mega-assistant-alex-gSuite-createCalendarEvent": initPluginGSuiteCalendarEvent,
	};

	const activatedTools: StructuredTool[] = [
		// knowledgeTool({ tags: [agentName, "knowledgeTool"] }),
		getCurrentDateAndTimeTool({ tags: [agentName, "getCurrentDateAndTimeTool"] }),
	];

	for (const pluginName of organizationPlugins) {
		const foundPlugin = Object.keys(availablePlugins).find(
			(_) => _ === pluginName
		) as availablePlugins;

		if (foundPlugin !== undefined) {
			const pluginConfig = await getPluginConfig(pluginName, organizationId);

			const initPluginFunc = availablePlugins[foundPlugin];
			const pluginTools = initPluginFunc({
				config: pluginConfig as any,
				conversationId,
				organizationId,
				tags: [agentName, foundPlugin],
				pluginId: "",
			});

			for (const pluginTool of pluginTools as any) {
				activatedTools.push(pluginTool);
			}
		} else {
			console.error("Requested organization plugin does not exist!");
		}
	}

	return activatedTools;
};

const createTools2 = async ({
	agentName,
	organizationId,
	conversationId,
}: {
	agentName: string;
	organizationId: string;
	conversationId: string;
}): Promise<StructuredTool[]> => {
	type availablePlugin =
		| "mega-assistant-alex-mailE-sendToHuman"
		| "mega-assistant-alex-gSuite-createCalendarEvent"
		| "mega-assistant-alex-knowledge";

	const availablePlugins = {
		"mega-assistant-alex-mailE-sendToHuman": initPluginMailESendToHuman,
		"mega-assistant-alex-gSuite-createCalendarEvent": initPluginGSuiteCalendarEvent,
		"mega-assistant-alex-knowledge": initPluginKnowledge,
	};

	const activatedTools: StructuredTool[] = [
		getCurrentDateAndTimeTool({ tags: [agentName, "getCurrentDateAndTimeTool"] }),
	];

	const alexPlugins = await getAlexPlugins(organizationId);
	for (const plugin of alexPlugins) {
		const { name, config, _id } = plugin;

		const foundInitFunc = Object.keys(availablePlugins).find(
			(_) => _ === name
		) as availablePlugin;

		if (!foundInitFunc) {
			console.error("Requested organization plugin does not exist!", name);
			continue;
		}

		// console.log("Activating plugin:", name);

		const initPluginFunc = availablePlugins[foundInitFunc];
		const pluginTools = initPluginFunc({
			config: config as any,
			conversationId,
			organizationId,
			tags: [agentName, name],
			pluginId: _id.toString(),
		});

		for (const pluginTool of pluginTools) {
			activatedTools.push(pluginTool);
		}
	}

	return activatedTools;
};

const createMemory = (sessionId: string) => {
	const collection = AlexMemory.collection as unknown as Collection;

	return new BufferMemory({
		chatHistory: new MongoDBChatMessageHistory({
			collection,
			sessionId,
		}),
		memoryKey: "alex_memory",
		outputKey: "output",
		inputKey: "input",
	});
};

interface IAgentAlexConfig {
	input: string;
	conversationId: string;
	organizationId: string;
	organizationSystemPrompt: string;
	organizationAbilities: string;
	organizationPlugins: string[];
	onStreamChunk?: (token: string, type: "assistant" | "tool") => void;
}

export default async function initAgentAlex({
	input,
	conversationId,
	organizationId,
	organizationSystemPrompt,
	organizationAbilities,
	organizationPlugins,
	onStreamChunk,
}: IAgentAlexConfig) {
	const agentName = "Alex";
	const tokenCounter = new TokenCounter();

	const llm = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0,
		streaming: true,
		callbacks: [new TokenCounterCallbackHandler(tokenCounter)],
	}) as unknown as BaseChatModel<BaseFunctionCallOptions, BaseMessageChunk>;

	const tools = await createTools2({
		// organizationPlugins,
		organizationId,
		conversationId,
		agentName,
	});

	const prompt = getPrompt();

	const agent = await createOpenAIFunctionsAgent({
		llm,
		tools,
		prompt,
		streamRunnable: true,
	});

	const memory = createMemory(conversationId);

	const agentExecutor = new AgentExecutor({
		agent,
		tools,
		memory,
		returnIntermediateSteps: true,
	});

	const startTime = Date.now();
	const stream = agentExecutor.streamEvents(
		{
			alex_memory: (await memory.loadMemoryVariables()).alex_memory,
			input,
			organizationSystemPrompt,
			organizationAbilities,
		},
		{ version: "v1" }
	);

	let output = "";
	const actions: IAction[] = [];

	for await (const chunk of stream) {
		const name = chunk.name;

		if (chunk.event === "on_llm_stream") {
			const function_call = chunk.data.chunk.message.additional_kwargs.function_call;

			if (function_call) {
				const { name, arguments: args } = function_call;
				if (name) {
					onStreamChunk?.(`tool-input__${name}`, "tool");
				} else {
					// onStreamChunk?.(args, "tool");
				}
			} else {
				const newToken = chunk.data.chunk.text;
				output += newToken;
				onStreamChunk?.(newToken, "assistant");
			}
		}

		if (chunk.event === "on_tool_start") {
			onStreamChunk?.(`tool-start__${name}`, "tool");
		}

		if (chunk.event === "on_tool_end") {
			onStreamChunk?.(`tool-end__${name}`, "tool");

			const { input, output } = chunk.data;
			const splitString = "Det lyckades! Dokument Id: ";

			if (output && `${output}`.startsWith(splitString)) {
				actions.push({
					type: chunk.name,
					docId: output.replace(splitString, ""),
					date: new Date(),
					input,
				} as IAction);
			}
		}
	}

	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = tokenCounter.getCount();

	return Promise.resolve({
		name: "mega-assistant-alex",
		responseTime,
		usedTokens,
		actions,
		output,
	});
}
