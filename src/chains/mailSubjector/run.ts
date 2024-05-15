import { ChatOpenAI } from "npm:@langchain/openai";
import getPrompt from "./prompts.ts";
import TokenCounter from "../../utils/tokenCounter.ts";
import { ILLMOutput } from "../../models/Message.ts";

type agentInput = {
	userMessage: string;
	assistantMessage: string;
};

export default async function runMailSubjector({
	userMessage,
	assistantMessage,
}: agentInput): Promise<ILLMOutput> {
	const agentName = "mail-subjector";

	const llm = new ChatOpenAI({
		modelName: "gpt-4o",
		temperature: 0,
	});

	const prompt = await getPrompt({
		systemMessage: "Du ska skriva ett ämne till ett mail.",
		userMessage,
		assistantMessage,
	});

	const startTime = Date.now();
	const { content, response_metadata } = await llm.invoke(prompt);
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
