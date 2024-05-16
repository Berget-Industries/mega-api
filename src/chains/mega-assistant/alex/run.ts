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
	type availablePlugins = "waiteraid" | "mega-assistant-alex-mailE-sendToHuman" | undefined;
	const availablePlugins = {
		waiteraid: initPluginWaiterAid,
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
	type availablePlugin = "waiteraid" | "mega-assistant-alex-mailE-sendToHuman";
	const availablePlugins = {
		waiteraid: initPluginWaiterAid,
		"mega-assistant-alex-knowledge": initPluginKnowledge,
		"mega-assistant-alex-mailE-sendToHuman": initPluginMailESendToHuman,
		"mega-assistant-alex-gSuite-createCalendarEvent": initPluginGSuiteCalendarEvent,
	};

	const activatedTools: StructuredTool[] = [
		getCurrentDateAndTimeTool({ tags: [agentName, "getCurrentDateAndTimeTool"] }),
	];

	const alexPlugins = await getAlexPlugins(organizationId);
	for (const plugin of alexPlugins) {
		const { name, config } = plugin;

		const foundInitFunc = Object.keys(availablePlugins).find(
			(_) => _ === name
		) as availablePlugin;

		if (!foundInitFunc) {
			console.error("Requested organization plugin does not exist!", name);
			continue;
		}

		console.log("Activating plugin:", name);

		const initPluginFunc = availablePlugins[foundInitFunc];
		const pluginTools = initPluginFunc({
			config: config as any,
			conversationId,
			organizationId,
			tags: [agentName, name],
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
	onStreamChunk?: (token: string) => void;
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

	console.log(organizationPlugins);

	const llm = new ChatOpenAI({
		model: "gpt-4o",
		temperature: 0,
		streaming: true,
		callbacks: [
			new TokenCounterCallbackHandler(tokenCounter),
			{
				handleLLMNewToken(token) {
					onStreamChunk?.(token);
				},
			},
		],
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
	const { output, intermediateSteps } = await agentExecutor.invoke({
		input,
		organizationSystemPrompt,
		organizationAbilities,
	});
	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = tokenCounter.getCount();

	const actions: IAction[] = intermediateSteps
		.filter((step: Record<string, any>) => step.action && step.observation)
		.map((step: Record<string, any>) => {
			const { action, observation } = step;
			const { tool, toolInput } = action;
			const docId = `${observation}`
				.replace("Det lyckades! Dokument Id: ", "")
				.split(": ")[0];

			const formattedAction: IAction = {
				type: tool,
				input: toolInput,
				docId: docId,
				date: new Date(),
			};

			return formattedAction;
		});

	return Promise.resolve({
		name: "mega-assistant-alex",
		responseTime,
		usedTokens,
		actions,
		output,
	});
}
