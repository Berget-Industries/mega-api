import { IAction } from "../../../models/Message.ts";
import mongoose from "npm:mongoose";
import AlexMemory from "../../../models/AlexMemory.ts";
import TokenCounter from "../../../utils/tokenCounter.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { IUsedTokens } from "../../../models/Message.ts";
import { BufferMemory } from "npm:langchain@^0.0.159/memory";
import { StructuredTool } from "npm:langchain@^0.0.159/tools";
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

export interface IPlugin {
	name: string;
	type: string;
	active: string;
	config: string;
}

const createTools = (agentName: string, activatedPlugins: IPlugin[]): StructuredTool[] => {
	type availablePlugins = "waiteraid" | undefined;
	const availablePlugins = {
		waiteraid: initPluginWaiterAid,
	};

	const activatedTools: StructuredTool[] = [
		knowledgeTool({ tags: [agentName, "knowledgeTool"] }),
		getCurrentDateAndTimeTool({ tags: [agentName, "getCurrentDateAndTimeTool"] }),
	];

	for (const plugin of activatedPlugins) {
		const foundPlugin = Object.keys(availablePlugins).find(
			(_) => _ === plugin.name
		) as availablePlugins;

		if (foundPlugin !== undefined) {
			const initPluginFunc = availablePlugins[foundPlugin];
			const pluginTools = initPluginFunc(plugin.config as any, [agentName, foundPlugin]);
			for (const pluginTool of pluginTools) {
				activatedTools.push(pluginTool);
			}
		} else {
			console.error("Requested organization plugin does not exist!");
		}
	}

	return activatedTools;
};

const createMemory = (sessionId: string) => {
	const dbModel = mongoose.model("AlexMemory");
	const collection = dbModel.collection;

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
	organizationSystemPrompt: string;
	organizationPlugins: IPlugin[];
}

export default async function initAgentAlex({
	input,
	conversationId,
	organizationSystemPrompt,
	organizationPlugins,
}: IAgentAlexConfig) {
	const agentName = "Alex";

	const model = new ChatOpenAI({
		temperature: 0,
		modelName: "gpt-4-1106-preview",
	});

	const tools = createTools(agentName, organizationPlugins);
	const memory = createMemory(conversationId);

	const agentArgs = {
		systemMessage: getSystemMessage(organizationSystemPrompt),
	};

	const tokenCounter = new TokenCounter();
	const actions: IAction[] = [];

	const agent = await initializeAgentExecutorWithOptions(tools, model, {
		handleParsingErrors: "Please try again, paying close attention to the allowed enum values",
		callbacks: [
			new LoggerCallbackHandler(),
			new TokenCounterCallbackHandler(tokenCounter.updateCount),
			new ActionCounterCallbackHandler(actions.push),
		],
		agentType: "openai-functions",
		tags: [agentName],
		verbose: false,
		agentArgs,
		memory,
	});

	const startTime = Date.now();
	const { output } = await agent.call({ input });
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
