import { ChatPromptTemplate } from "npm:langchain@^0.0.159/prompts";
import { LoggerCallbackHandler } from "../callbackHandlers/index.ts";
import { systemPrompt } from "./prompts.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { LLMChain } from "npm:langchain@^0.0.159/chains";
import { getChatPrompt } from "./prompts.ts";
import TokenCounter from "../../utils/tokenCounter.ts";
import { TokenCounterCallbackHandler } from "../callbackHandlers/index.ts";
import { ILLMOutput } from "../../models/Message.ts";

type agentInput = {
	userMessage: string;
	assistantMessage: string;
};

export default async function runManualFilterChain({
	userMessage,
	assistantMessage,
}: agentInput): Promise<ILLMOutput> {
	const agentName = "mail-subjector";

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
		callbacks: [new LoggerCallbackHandler()],
		outputKey: "output",
		prompt: chatPrompt,
		tags: [agentName],
		llm,
	});

	const startTime = Date.now();
	const { output } = await chain.call(
		{
			userMessage,
			assistantMessage,
		},
		{
			callbacks: [new TokenCounterCallbackHandler(tokenCounter)],
		}
	);
	const endTime = Date.now();
	const responseTime = endTime - startTime;

	const usedTokens = tokenCounter.getCount();

	return Promise.resolve({
		responseTime,
		usedTokens,
		actions: [],
		output,
		name: agentName,
	});
}
