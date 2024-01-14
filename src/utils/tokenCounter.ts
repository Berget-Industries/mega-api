import { IUsedTokens } from "../models/Message.ts";

export default class TokenCounter {
	input = 0;
	output = 0;
	total = 0;

	updateCount(_: IUsedTokens) {
		this.input += _.input;
		this.output += _.output;
		this.total += _.total;
	}

	getCount(): IUsedTokens {
		return {
			input: this.input,
			output: this.output,
			total: this.total,
		};
	}
}
