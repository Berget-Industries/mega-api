// Test för AiAccessKey.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import AiAccessKey from "../../src/models/AiAccessKey.ts"; // Uppdatera sökvägen om nödvändigt
import { Types } from "mongoose";

const sandbox = sinon.createSandbox();

Deno.test("AiAccessKey Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(AiAccessKey.prototype, "save").resolves();

		const testAiAccessKey = new AiAccessKey({
			key: "someUniqueKey",
			organization: new Types.ObjectId("507f191e810c19729de860ea"),
		});

		await testAiAccessKey.save();
		const aiAccessKeyObject = testAiAccessKey.toObject();

		assertEquals(typeof aiAccessKeyObject.key, "string", "key bör vara en sträng");
		assertEquals(
			aiAccessKeyObject.organization instanceof Types.ObjectId,
			true,
			"organization bör vara en ObjectId"
		);

		const allowedFields = ["_id", "key", "organization"];
		Object.keys(aiAccessKeyObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
