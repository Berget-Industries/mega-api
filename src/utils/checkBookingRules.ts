import rulesFile from "../../config.json" with { type: "json" };

export interface Rule {
	inputKey: string;
	max: number | string;
	min: number | string;
	message: string;
}

export type BrokenRule = Record<string, string>;

export function checkBookingRules(input: any, rules: Rule[]): BrokenRule[] {
	const brokenRules: BrokenRule[] = [];
	rules.forEach(({ inputKey, max, min, message }: Rule) => {
		if (input[inputKey] > max || input[inputKey] < min) {
			brokenRules.push({ inputKey, message });
			console.log(brokenRules)
		}
	});

	return brokenRules;
}

export const checkChambreBookingRules = (input: object) => checkBookingRules(input, rulesFile.rules.chambreBookingRules);
export const checkNormalBookingRules = (input: object) => checkBookingRules(input, rulesFile.rules.normalBookingRules);