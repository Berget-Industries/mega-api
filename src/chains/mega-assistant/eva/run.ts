import { LLMChain } from "npm:langchain@^0.0.159/chains";
import TokenCounter from "../../../utils/TokenCounter.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { IUsedTokens } from "../../../models/Message.ts";
import { ChatPromptTemplate } from "npm:langchain@^0.0.159/prompts";
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
		callbacks: [
			new LoggerCallbackHandler(),
			new TokenCounterCallbackHandler(tokenCounter.updateCount),
		],
		outputKey: "output",
		prompt: chatPrompt,
		tags: [agentName],
		llm,
	});

	const startTime = Date.now();
	const { output } = await chain.call({
		organizationSystemPrompt,
		mailToReWrite,
		nameOfUser,
	});
	const endTime = Date.now();

	const responseTime = endTime - startTime;

	return Promise.resolve({
		responseTime,
		usedTokens,
		output,
	});
}
