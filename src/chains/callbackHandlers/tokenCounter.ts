import { BaseCallbackHandler } from "npm:langchain@^0.0.159/callbacks";
import { LLMResult } from "npm:langchain@^0.0.159/schema";
import { IUsedTokens } from "../../models/Message.ts";

type onCount = (newCount: IUsedTokens) => void;

export default class TokenCounterCallbackHandler extends BaseCallbackHandler {
	name = "TokenCounterCallbackHandler";
	onCount: onCount;

	constructor(onCount: onCount) {
		super();
		this.onCount = onCount.bind(this);
	}

	handleLLMEnd(
		output: LLMResult,
		runId: string,
		parentRunId?: string | undefined,
		tags?: string[] | undefined
	) {
		const { completionTokens, promptTokens, totalTokens } = output.llmOutput?.tokenUsage;
		this.onCount({
			output: completionTokens,
			input: promptTokens,
			total: totalTokens,
		});
	}
}
