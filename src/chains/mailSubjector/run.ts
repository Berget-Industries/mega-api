import { ChatPromptTemplate } from "npm:langchain@^0.0.159/prompts";
import { LoggerCallbackHandler } from "../callbackHandlers/index.ts";
import { systemPrompt } from "./prompts.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { LLMChain } from "npm:langchain@^0.0.159/chains";
import { getChatPrompt } from "./prompts.ts";
import TokenCounter from "../../utils/tokenCounter.ts";
import { TokenCounterCallbackHandler } from "../callbackHandlers/index.ts";

type agentInput = {
	userMessage: string;
	assistantMessage: string;
};

export default async function runManualFilterChain({ userMessage, assistantMessage }: agentInput) {
	const agentName = "Mail Subjector";

	const tokenCounter = new TokenCounter();

	const llm = new ChatOpenAI({
		modelName: "gpt-4-1106-preview",
		temperature: 0,
	});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		["system", systemPrompt()],
		["human", getChatPrompt()],
	]);

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

	const { output } = await chain.call({
		userMessage,
		assistantMessage,
	});

	const usedTokens = tokenCounter.getCount();

	return Promise.resolve({
		output,
		usedTokens,
	});
}
