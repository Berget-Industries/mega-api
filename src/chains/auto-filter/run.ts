import { LoggerCallbackHandler } from "../callbackHandlers/index.ts";
import { ChatOpenAI } from "npm:@langchain/openai";

import prompt from "./prompt.ts";
import TokenCounter from "../../utils/tokenCounter.ts";
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
		modelName: "gpt-4o",
		temperature: 0,
		// callbacks: [new LoggerCallbackHandler()],
	});

	const promptText = await prompt({
		organizationAbilities,
		organizationExamples,
		organizationRules,
		message,
	});

	const startTime = Date.now();
	const { content, response_metadata } = await llm.invoke(promptText);
	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = TokenCounter.format(response_metadata.tokenUsage);
	const output = content as string;

	return Promise.resolve({
		responseTime,
		usedTokens,
		actions: [],
		output,
		name: agentName,
	});
}
