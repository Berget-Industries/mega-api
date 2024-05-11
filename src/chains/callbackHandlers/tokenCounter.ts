import { BaseCallbackHandler } from "npm:langchain@latest/callbacks";
import { ChainValues } from "npm:langchain@latest/schema";
import { LLMResult } from "npm:langchain@latest/schema";
import { IUsedTokens } from "../../models/Message.ts";
import TokenCounter from "../../utils/tokenCounter.ts";

export default class TokenCounterCallbackHandler extends BaseCallbackHandler {
	name = "TokenCounterCallbackHandler";
	counter: TokenCounter;

	constructor(counter: TokenCounter) {
		super();
		this.counter = counter;
	}

	handleLLMEnd(
		output: LLMResult,
		runId: string,
		parentRunId?: string | undefined,
		tags?: string[] | undefined
	) {
		console.log(output.generations[0]);
	}
}
