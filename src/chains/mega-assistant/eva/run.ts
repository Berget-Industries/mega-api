import { LLMChain } from "npm:langchain@latest/chains";
import TokenCounter from "../../../utils/tokenCounter.ts";
import { ChatOpenAI } from "npm:langchain@latest/chat_models/openai";
import { ChatPromptTemplate } from "npm:langchain@latest/prompts";
import { getSystemMessage, getUserMessage } from "./prompts.ts";
import {
	LoggerCallbackHandler,
	TokenCounterCallbackHandler,
} from "../../callbackHandlers/index.ts";

type agentInput = {
	nameOfUser: string;
	mailToReWrite: string;
	organizationSystemPrompt: string;
	organizationModel: string;
};

export default async function runEva({
	organizationSystemPrompt,
	organizationModel,
	mailToReWrite,
	nameOfUser,
}: agentInput) {
	const agentName = "Eva";

	const llm = new ChatOpenAI({
		modelName: organizationModel,
		temperature: 0,
	});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		["system", getSystemMessage()],
		["human", getUserMessage()],
	]);

	const tokenCounter = new TokenCounter();

	const chain = new LLMChain({
		callbacks: [new LoggerCallbackHandler()],
		outputKey: "output",
		prompt: chatPrompt,
		tags: [agentName],
		llm,
	});

	const startTime = Date.now();
	const { output } = await chain.call(
		{
			organizationSystemPrompt,
			mailToReWrite,
			nameOfUser,
		},
		{
			callbacks: [new TokenCounterCallbackHandler(tokenCounter)],
		}
	);
	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = tokenCounter.getCount();

	return Promise.resolve({
		name: "mega-assistant-eva",
		responseTime,
		usedTokens,
		actions: [],
		output,
	});
}
