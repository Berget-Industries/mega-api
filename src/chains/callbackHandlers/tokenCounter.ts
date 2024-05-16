import { BaseCallbackHandler } from "npm:@langchain/core/callbacks/base";
import TokenCounter from "../../utils/tokenCounter.ts";

export default class TokenCounterCallbackHandler extends BaseCallbackHandler {
	name = "TokenCounterCallbackHandler";
	counter: TokenCounter;

	constructor(counter: TokenCounter) {
		super();
		this.counter = counter;
	}

	handleLLMStart(llm: any, prompts: string[]) {
		console.log(prompts[0]);
		const numberOfTokens = TokenCounter.calculateTokens(prompts[0]);
		this.counter.updateCount({
			output: 0,
			input: numberOfTokens,
			total: numberOfTokens,
		});
	}

	handleLLMNewToken(token: string) {
		const numberOfTokens = TokenCounter.calculateTokens(token);
		this.counter.updateCount({
			output: numberOfTokens,
			input: 0,
			total: numberOfTokens,
		});
	}
}
