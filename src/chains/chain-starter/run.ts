import { ChatOpenAI } from "npm:@langchain/openai";
import TokenCounter from "../../utils/tokenCounter.ts";
import getPrompt from "./prompts.ts";
import { ILLMOutput } from "../../models/Message.ts";

export interface IRunChainStarterConfig {
	organizationSystemMessage: string;
	messageInstructions: string;
	contactInformation: string;
	contactName: string;
}

export default async function runChainStarterChain({
	organizationSystemMessage,
	messageInstructions,
	contactInformation,
	contactName,
}: IRunChainStarterConfig): Promise<ILLMOutput> {
	const agentName = "chain-starter";

	const llm = new ChatOpenAI({
		modelName: "gpt-4o",
		temperature: 0.25,
	});

	const prompt = await getPrompt({
		organizationSystemMessage,
		contactInformation,
		contactName,
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
