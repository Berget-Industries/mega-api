import { IAction } from "../../../models/Message.ts";
import AlexMemory from "../../../models/AlexMemory.ts";
import TokenCounter from "../../../utils/tokenCounter.ts";
import { ChatOpenAI } from "npm:langchain@latest/chat_models/openai";
import getPluginConfig from "../../../utils/getPluginConfig.ts";
import { BufferMemory } from "npm:langchain@latest/memory";
import { StructuredTool } from "npm:langchain@latest/tools";

import { convertToOpenAIFunction } from "npm:langchain@latest/core/utils/function_calling";
import { AgentExecutor, createOpenAIFunctionsAgent } from "npm:langchain@latest/agents";
import { OpenAIAssistantRunnable } from "npm:langchain@latest/experimental/openai_assistant";

import { getPrompt } from "./prompts.ts";
import { MongoDBChatMessageHistory } from "npm:@langchain/mongodb";
import {
	ActionCounterCallbackHandler,
	TokenCounterCallbackHandler,
	LoggerCallbackHandler,
} from "../../callbackHandlers/index.ts";

// REGULAR TOOLS
import knowledgeTool from "./tools/knowledgeTool.ts";
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

const createMemory = (sessionId: string) => {
	const collection = AlexMemory.collection;

	return new BufferMemory({
		chatHistory: new MongoDBChatMessageHistory({
			collection,
			sessionId,
		}),
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

	const llm = new ChatOpenAI({
		model: "gpt-4-turbo-preview",
		temperature: 0,
		verbose: false,
		streaming: Boolean(onStreamChunk),
		callbacks: [
			{
				handleLLMEnd(output) {
					console.log(output);
				},
			},
		],
	});

	const tools = await createTools({
		organizationPlugins,
		organizationId,
		conversationId,
		agentName,
	});

	const prompt = getPrompt({
		organizationSystemPrompt,
		organizationAbilities,
	});

	const agent = await createOpenAIFunctionsAgent({
		llm,
		tools,
		prompt,
	});

	const memory = createMemory(conversationId);

	const actions: IAction[] = [];

	const agentExecutor = new AgentExecutor({
		agent,
		tools,
		memory,
		returnIntermediateSteps: true,
	});

	const startTime = Date.now();
	const res = await agentExecutor.invoke(
		{ input },
		{
			callbacks: [
				{
					handleLLMNewToken(token) {
						onStreamChunk?.(token);
					},
				},
			],
		}
	);
	const output = res.output;
	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = tokenCounter.getCount();

	console.log(usedTokens);
	console.log(actions);

	return Promise.resolve({
		name: "mega-assistant-alex",
		responseTime,
		usedTokens,
		actions,
		output,
	});
}
