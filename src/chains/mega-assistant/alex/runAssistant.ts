import { IAction } from "../../../models/Message.ts";
import AlexMemory from "../../../models/AlexMemory.ts";
import TokenCounter from "../../../utils/tokenCounter.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import getPluginConfig from "../../../utils/getPluginConfig.ts";
import { BufferMemory } from "npm:langchain@^0.0.159/memory";
import { StructuredTool } from "npm:langchain@^0.0.159/tools";

import { AgentExecutor } from "npm:langchain@latest/agents";
import { OpenAIAssistantRunnable } from "npm:langchain@latest/experimental/openai_assistant";

import { getSystemMessage } from "./prompts.ts";
import { MongoDBChatMessageHistory } from "npm:langchain@^0.0.159/stores/message/mongodb";
import { initializeAgentExecutorWithOptions } from "npm:langchain@^0.0.159/agents";
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
		memoryKey: "chat_history",
		returnMessages: true,
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

	const tools = await createTools({
		organizationPlugins,
		organizationId,
		conversationId,
		agentName,
	});

	const agent = await OpenAIAssistantRunnable.createAssistant({
		model: "gpt-3.5-turbo-1106",
		instructions: "You are a weather bot. Use the provided functions to answer questions.",
		name: "Weather Assistant",
		tools,
		asAgent: true,
	});
	const agentExecutor = AgentExecutor.fromAgentAndTools({
		agent,
		tools,
	});

	const agentArgs = {
		systemMessage: getSystemMessage({ organizationSystemPrompt, organizationAbilities }),
	};

	console.log(agentArgs.systemMessage);

	const tokenCounter = new TokenCounter();
	const actions: IAction[] = [];

	const startTime = Date.now();
	const { output } = await agent.invoke(
		{ input },
		{
			callbacks: [
				{
					handleLLMStart(llm, prompt) {
						prompt.forEach(console.log);
					},
				},
				{
					handleLLMNewToken(token: string) {
						onStreamChunk && onStreamChunk(token);
					},
				},
			],
		}
	);
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
