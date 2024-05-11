import { ChatPromptTemplate } from "npm:langchain@latest/prompts";
import { LoggerCallbackHandler } from "../callbackHandlers/index.ts";
import { systemPrompt } from "./prompts.ts";
import { ChatOpenAI } from "npm:langchain@latest/chat_models/openai";
import { LLMChain } from "npm:langchain@latest/chains";
import TokenCounter from "../../utils/tokenCounter.ts";
import { getChatPrompt } from "./prompts.ts";
import { TokenCounterCallbackHandler } from "../callbackHandlers/index.ts";
import { ILLMOutput } from "../../models/Message.ts";

export interface IRunAutoFilterConfig {
	organizationAbilities: string | undefined;
	organizationExamples: string;
	organizationRules: Record<string, string>;
	message: string;
}

export default async function runManualFilterChain({
	organizationAbilities,
	organizationExamples,
	organizationRules,
	message,
}: IRunAutoFilterConfig): Promise<ILLMOutput> {
	const agentName = "auto-filter";

	const llm = new ChatOpenAI({
		modelName: "gpt-4-0125-preview",
		temperature: 0,
	});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		["system", systemPrompt(organizationRules, organizationAbilities)],
		["human", getChatPrompt()],
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
			organizationAbilities,
			organizationExamples,
			message,
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
