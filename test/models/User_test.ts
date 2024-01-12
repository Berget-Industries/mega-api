// Test för User.ts
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import User from "../../src/models/User.ts";
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

Deno.test("User Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(User.prototype, "save").resolves();

		// Skapa en testinstans av User
		const testUser = new User({
			name: "Test User",
			password: "password123",
			email: "test@example.com",
			avatarUrl: "http://example.com/avatar.jpg",
			organizations: [new Types.ObjectId("507f191e810c19729de860ea")],
			systemAdmin: false,
		});

		await testUser.save();

		const userObject = testUser.toObject();

		// Kontrollera fält och deras typer
		assertEquals(typeof userObject.name, "string", "name bör vara en sträng");
		assertEquals(typeof userObject.password, "string", "password bör vara en sträng");
		assertEquals(typeof userObject.email, "string", "email bör vara en sträng");
		assertEquals(typeof userObject.avatarUrl, "string", "avatarUrl bör vara en sträng");
		assertEquals(
			Array.isArray(userObject.organizations),
			true,
			"organizations bör vara en array av ObjectId"
		);
		assertEquals(typeof userObject.systemAdmin, "boolean", "systemAdmin bör vara en boolean");

		// Kontrollera att inga oväntade fält finns
		const allowedFields = [
			"_id",
			"name",
			"password",
			"email",
			"avatarUrl",
			"organizations",
			"systemAdmin",
		];
		Object.keys(userObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
