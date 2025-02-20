// Test för AiAccessKey.ts
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import ApiKey from "../../src/models/ApiKey.ts"; // Uppdatera sökvägen om nödvändigt
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

Deno.test("ApiKey Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(ApiKey.prototype, "save").resolves();

		const testApiKey = new ApiKey({
			key: "someUniqueKey",
		});

		await testApiKey.save();
		const apiKeyObject = testApiKey.toObject();

		assertEquals(typeof apiKeyObject.key, "string", "key bör vara en sträng");
		assertEquals(typeof apiKeyObject.systemKey, "boolean", "systemKey bör vara en boolean");

		const allowedFields = ["_id", "key", "systemKey"];
		Object.keys(apiKeyObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
