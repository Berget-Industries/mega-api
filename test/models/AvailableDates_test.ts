// Test för AvailableDates.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import AvailableDates from "../../src/models/AvailableDates.ts";
import { Types } from "mongoose";

const sandbox = sinon.createSandbox();

Deno.test("AvailableDates Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(AvailableDates.prototype, "save").resolves();

		const testAvailableDates = new AvailableDates({
			date: new Date(),
			lunch: { isAvailable: true, _id: null },
			dinner: { isAvailable: false, _id: null },
		});

		await testAvailableDates.save();
		const availableDatesObject = testAvailableDates.toObject();

		assertEquals(
			availableDatesObject.date instanceof Date,
			true,
			"date bör vara ett Date objekt"
		);
		assertEquals(typeof availableDatesObject.lunch, "object", "lunch bör vara ett objekt");
		assertEquals(typeof availableDatesObject.dinner, "object", "dinner bör vara ett objekt");

		const allowedFields = ["_id", "date", "lunch", "dinner"];
		Object.keys(availableDatesObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
