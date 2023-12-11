// Test för Message.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import Message from "../../src/models/Message.ts";
import { Types } from "mongoose";

const sandbox = sinon.createSandbox();

Deno.test("Message Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(Message.prototype, "save").resolves();

		const testMessage = new Message({
			organization: new Types.ObjectId("507f191e810c19729de860ea"),
			conversation: new Types.ObjectId("507f191e810c19729de860eb"),
			contact: new Types.ObjectId("507f191e810c19729de860ec"),
			createdAt: new Date(),
			input: "Test input",
			llmOutput: [], // Antag att detta är en tom array för teständamål
		});

		await testMessage.save();
		const messageObject = testMessage.toObject();

		assertEquals(
			messageObject.organization instanceof Types.ObjectId,
			true,
			"organizationId bör vara en ObjectId"
		);
		assertEquals(
			messageObject.conversation instanceof Types.ObjectId,
			true,
			"conversationId bör vara en ObjectId"
		);
		assertEquals(
			messageObject.contact instanceof Types.ObjectId,
			true,
			"contactId bör vara en ObjectId"
		);
		assertEquals(
			messageObject.createdAt instanceof Date,
			true,
			"createdAt bör vara ett Date objekt"
		);
		assertEquals(typeof messageObject.input, "string", "input bör vara en sträng");
		assertEquals(Array.isArray(messageObject.llmOutput), true, "llmOutput bör vara en array");

		const allowedFields = [
			"_id",
			"organization",
			"conversation",
			"contact",
			"createdAt",
			"input",
			"llmOutput",
		];
		Object.keys(messageObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
