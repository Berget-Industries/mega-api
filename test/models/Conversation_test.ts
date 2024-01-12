// Importera nödvändiga bibliotek och moduler
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import Conversation from "../../src/models/Conversation.ts";
import { Types } from "npm:mongoose";

// Skapa en sandbox för att kunna återställa miljön efter testerna
const sandbox = sinon.createSandbox();

Deno.test("Conversation Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(Conversation.prototype, "save").resolves();

		const testConversation = new Conversation({
			organization: new Types.ObjectId("507f191e810c19729de860ea"),
			contact: new Types.ObjectId("507f191e810c19729de860eb"),
			messages: [],
			lastActivity: new Date(),
		});

		await testConversation.save();
		const conversationObject = testConversation.toObject();

		assertEquals(
			conversationObject.organization instanceof Types.ObjectId,
			true,
			"organizationId bör vara en ObjectId"
		);
		assertEquals(
			conversationObject.contact instanceof Types.ObjectId,
			true,
			"contactId bör vara en ObjectId"
		);
		assertEquals(
			Array.isArray(conversationObject.messages),
			true,
			"messages bör vara en array"
		);
		assertEquals(
			conversationObject.lastActivity instanceof Date,
			true,
			"lastActivity bör vara ett Date objekt"
		);

		// Kontrollera att inga oväntade fält finns
		const allowedFields = ["_id", "organization", "contact", "messages", "lastActivity"];
		Object.keys(conversationObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		// Rensa upp sandbox oavsett om testet lyckas eller misslyckas
		sandbox.restore();
	}
});
