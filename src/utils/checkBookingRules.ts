import rulesFile from "../../config.json" with { type: "json" };

type ruleValue = string | number;
export interface Rule {
	inputKey: string;
	max:ruleValue;
	min:ruleValue;
	message: string;
	parseValue?(input:ruleValue): ruleValue
}

export type BrokenRule = Record<string, string>;

export function checkBookingRules(input: any, rules: Rule[]): BrokenRule[] {

	const allRules: Rule[] = [
		{
			inputKey: "date",
			max: 999999999999,
			min: new Date().getTime() / 1000,
			message: "Bokningen måste vara i framtiden. Det går inte att boka ett datum som redan har varit.",
			parseValue: (_) => (new Date(_).getTime())
		},
		...rules,
	];

	console.log(allRules)

	const brokenRules: BrokenRule[] = [];
	allRules.forEach(({ inputKey, max, min, message, parseValue }: Rule) => {
		let valueToCheck = input[inputKey];
		
		if (parseValue) {
			valueToCheck = parseValue(valueToCheck);
		}

		if (valueToCheck > max || valueToCheck < min) {
			brokenRules.push({ inputKey, message });
			console.log(brokenRules)
		}
	});

	return brokenRules;
}

export const checkChambreBookingRules = (input: object) => checkBookingRules(input, rulesFile.rules.chambreBookingRules);
export const checkNormalBookingRules = (input: object) => checkBookingRules(input, rulesFile.rules.normalBookingRules);