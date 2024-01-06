// Test för Reservation.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import Reservation from "../../src/models/Reservation.ts";
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

Deno.test("Reservation Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(Reservation.prototype, "save").resolves();

		const testReservation = new Reservation({
			chambre: true,
			name: "Test name",
			email: "Test email",
			phone: "Test phone",
			date: new Date(),
			numberOfGuests: 4,
			comment: "Test comment",
			menu: { asd: "asd" },
			conversations: [new Types.ObjectId("507f191e810c19729de860ea")],
			organization: new Types.ObjectId("507f191e810c19729de860eb"),
		});

		await testReservation.save();
		const reservationObject = testReservation.toObject();

		assertEquals(typeof reservationObject.chambre, "boolean", "chambre bör vara en boolean");
		assertEquals(typeof reservationObject.name, "string", "name bör vara en sträng");
		assertEquals(typeof reservationObject.email, "string", "email bör vara en sträng");
		assertEquals(typeof reservationObject.phone, "string", "phone bör vara en sträng");
		assertEquals(reservationObject.date instanceof Date, true, "date bör vara ett Date objekt");
		assertEquals(
			typeof reservationObject.numberOfGuests,
			"number",
			"numberOfGuests bör vara en number"
		);
		assertEquals(typeof reservationObject.comment, "string", "comment bör vara en sträng");
		assertEquals(typeof reservationObject.menu, "object", "menu bör vara ett objekt");
		assertEquals(
			Array.isArray(reservationObject.conversations),
			true,
			"conversations bör vara en array av ObjectId"
		);
		assertEquals(
			reservationObject.organization instanceof Types.ObjectId,
			true,
			"organization bör vara en ObjectId"
		);

		const allowedFields = [
			"_id",
			"chambre",
			"name",
			"email",
			"phone",
			"date",
			"numberOfGuests",
			"comment",
			"menu",
			"conversations",
			"organization",
		];
		Object.keys(reservationObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
