// Test för ResetPasswordToken.ts
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import ResetPasswordToken from "../../src/models/ResetPasswordToken.ts"; // Uppdatera sökvägen om nödvändigt

const sandbox = sinon.createSandbox();

Deno.test("ResetPasswordToken Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(ResetPasswordToken.prototype, "save").resolves();

		const testResetPasswordToken = new ResetPasswordToken({
			email: "example@example.com",
			token: "someRandomTokenString",
		});

		await testResetPasswordToken.save();
		const resetPasswordTokenObject = testResetPasswordToken.toObject();

		assertEquals(typeof resetPasswordTokenObject.email, "string", "email bör vara en sträng");
		assertEquals(typeof resetPasswordTokenObject.token, "string", "token bör vara en sträng");

		const allowedFields = ["_id", "email", "token"];
		Object.keys(resetPasswordTokenObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
