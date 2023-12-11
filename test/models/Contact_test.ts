// Test för Contact.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import Contact from "../../src/models/Contact.ts";

const sandbox = sinon.createSandbox();

Deno.test("Contact Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(Contact.prototype, "save").resolves();

		const testContact = new Contact({
			name: "Test Person",
			email: "test@example.com",
			phoneNumber: "1234567890",
			avatarUrl: "http://example.com/avatar.jpg",
		});

		await testContact.save();
		const contactObject = testContact.toObject();

		assertEquals(typeof contactObject.name, "string", "name bör vara en sträng");
		assertEquals(typeof contactObject.email, "string", "email bör vara en sträng");
		assertEquals(typeof contactObject.phoneNumber, "string", "phoneNumber bör vara en sträng");
		assertEquals(typeof contactObject.avatarUrl, "string", "avatarUrl bör vara en sträng");

		const allowedFields = ["_id", "name", "email", "phoneNumber", "avatarUrl"];
		Object.keys(contactObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
