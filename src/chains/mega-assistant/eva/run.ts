import { ChatOpenAI } from "npm:@langchain/openai";

import { TokenCounterCallbackHandler } from "../../callbackHandlers/index.ts";

import getPrompt from "./prompts.ts";
import TokenCounter from "../../../utils/tokenCounter.ts";

type agentInput = {
	nameOfUser: string;
	mailToReWrite: string;
	organizationSystemPrompt: string;
	organizationModel: string;
	onStreamChunk?: (chunk: string) => void;
};

export default async function runEva({
	organizationSystemPrompt,
	organizationModel,
	mailToReWrite,
	onStreamChunk,
	nameOfUser,
}: agentInput) {
	const agentName = "mega-assistant-eva";
	const tokenCounter = new TokenCounter();

	const llm = new ChatOpenAI({
		modelName: organizationModel,
		temperature: 0,
		streaming: true,
		callbacks: [new TokenCounterCallbackHandler(tokenCounter)],
	});

	const prompt = await getPrompt({
		organizationSystemPrompt,
		mailToReWrite,
		nameOfUser,
	});

	let output: string = "";

	const startTime = Date.now();

	const stream = await llm.stream(prompt);
	for await (const chunk of stream) {
		const nextToken = chunk.content as string;
		onStreamChunk && onStreamChunk(nextToken);
		output += nextToken;
	}

	const endTime = Date.now();

	const responseTime = endTime - startTime;
	const usedTokens = tokenCounter.getCount();

	return Promise.resolve({
		name: agentName,
		responseTime,
		usedTokens,
		actions: [],
		output,
	});
}
