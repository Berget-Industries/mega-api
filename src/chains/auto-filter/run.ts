import { ChatPromptTemplate } from "npm:langchain@^0.0.159/prompts";
import { LoggerCallbackHandler } from "../callbackHandlers/index.ts";
import { systemPrompt } from "./prompts.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { LLMChain } from "npm:langchain@^0.0.159/chains";
import TokenCounter from "../../utils/tokenCounter.ts";
import { getChatPrompt } from "./prompts.ts";
import { TokenCounterCallbackHandler } from "../callbackHandlers/index.ts";

export interface IRunAutoFilterConfig {
	organizationExamples: string;
	organizationRules: Record<string, string>;
	message: string;
}

export default async function runManualFilterChain({
	organizationExamples,
	organizationRules,
	message,
}: IRunAutoFilterConfig) {
	const agentName = "auto-filter";

	const llm = new ChatOpenAI({
		modelName: "gpt-4-1106-preview",
		temperature: 0,
	});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		["system", systemPrompt(organizationRules)],
		["human", getChatPrompt()],
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

	const { output } = await chain.call({
		organizationExamples,
		message,
	});

	return Promise.resolve({
		usedTokens: tokenCounter.getCount(),
		output,
	});
}
