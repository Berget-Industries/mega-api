import { get_encoding, encoding_for_model, TiktokenEncoding } from "npm:tiktoken";
import { IUsedTokens } from "../models/Message.ts";

interface IRawUsedTokens {
	completionTokens: number;
	promptTokens: number;
	totalTokens: number;
}

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

	static format(_: IRawUsedTokens): IUsedTokens {
		try {
			return {
				input: _.promptTokens,
				output: _.completionTokens,
				total: _.totalTokens,
			};
		} catch (error) {
			console.error(error);
			return {
				input: 0,
				output: 0,
				total: 0,
			};
		}
	}

	static calculateTokens(prompt: string, model: TiktokenEncoding = "gpt2"): number {
		const enc = get_encoding(model);

		const encodedString = enc.encode(prompt);
		enc.free();

		const tokens = encodedString.length;
		return tokens;
	}
}
