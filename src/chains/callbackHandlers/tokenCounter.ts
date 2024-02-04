import { BaseCallbackHandler } from "npm:langchain@^0.0.159/callbacks";
import { ChainValues } from "npm:langchain@^0.0.159/schema";
import { LLMResult } from "npm:langchain@^0.0.159/schema";
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
		const { completionTokens, promptTokens, totalTokens } = output.llmOutput?.tokenUsage;
		const newCount = {
			output: completionTokens,
			input: promptTokens,
			total: totalTokens,
		};
		this.counter.updateCount(newCount);
	}
}
