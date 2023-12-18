// Test för checkBookingRules funktionen
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { checkBookingRules, Rule } from "../../src/utils/checkBookingRules.ts"; // Ersätt med sökvägen till din modul

const sandbox = sinon.createSandbox();

Deno.test("checkBookingRules - Identifierar regelbrott", () => {
	try {
		const rules: Rule[] = [
			{
				inputKey: "date",
				max: 999999999999,
				min: new Date().getTime() / 1000,
				message:
					"Bokningen måste vara i framtiden. Det går inte att boka ett datum som redan har varit.",
				parseValue: (input) => new Date(input).getTime() / 1000,
			},
			// Här kan du lägga till fler regler vid behov
		];

		// Testfall 1: Input som inte bryter mot reglerna
		const inputValid = { date: new Date(Date.now() + 1000000) }; // Framtida datum
		const resultValid = checkBookingRules(inputValid, rules);
		assertEquals(resultValid.length, 0, "Inga regelbrott för giltig input");

		// Testfall 2: Input som bryter mot reglerna
		const inputInvalid = { date: new Date(Date.now() - 1000000) }; // Förflutet datum
		const resultInvalid = checkBookingRules(inputInvalid, rules);
		assertEquals(
			resultInvalid.length > 0,
			true,
			"Regelbrott bör identifieras för ogiltig input"
		);
		assertEquals(
			resultInvalid[0].inputKey,
			"date",
			"Regelbrott ska identifiera korrekt inputKey"
		);
		assertEquals(
			resultInvalid[0].message,
			"Bokningen måste vara i framtiden. Det går inte att boka ett datum som redan har varit.",
			"Korrekt felmeddelande för regelbrott"
		);
	} finally {
		sandbox.restore();
	}
});
