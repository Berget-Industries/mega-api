import rulesFile from "../../config.json";

export interface Rule {
	inputKey: string;
	max: number | string;
	min: number | string;
	message: string;
}

export type BrokenRule = Record<string, string>;

export function checkChambreBookingRules(input: any): BrokenRule[] {
	const rules = rulesFile.rules.chambreBookingRules;

	const brokenRules: BrokenRule[] = [];
	rules.forEach(({ inputKey, max, min, message }: Rule) => {
		if (input[inputKey] > max || input[inputKey] < min) {
			brokenRules.push({ [inputKey]: message });
		}
	});

	return brokenRules;
}
