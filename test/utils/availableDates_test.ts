// Test för checkAvailableDates funktionen
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { checkAvailableDates } from "../../src/utils/availableDates.ts"; // Ersätt med sökvägen till din modul
import AvailableDates from "../../src/models/AvailableDates.ts";
import * as moment from "npm:moment";

const sandbox = sinon.createSandbox();

Deno.test("checkAvailableDates - Funktionens beteende", async () => {
	try {
		const findOneStub = sandbox.stub(AvailableDates, "findOne");

		// Simulera svar för lunchtid
		findOneStub.withArgs(sinon.match.has("date")).resolves({
			lunch: { isAvailable: true },
			dinner: { isAvailable: false },
		});

		// Testfall 1: Lunchtid är tillgänglig
		const result1 = await checkAvailableDates({
			date: new Date("2023-01-01"),
			time: "12:00",
		});
		assertEquals(result1, true, "Lunchtid bör vara tillgänglig");

		// Testfall 2: Middagstid är inte tillgänglig
		const result2 = await checkAvailableDates({
			date: new Date("2023-01-01"),
			time: "19:00",
		});
		assertEquals(result2, false, "Middagstid bör inte vara tillgänglig");
	} finally {
		sandbox.restore();
	}
});
