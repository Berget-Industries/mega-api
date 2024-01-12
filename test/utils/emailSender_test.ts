// Test för sendResetPasswordMail funktionen
import { assert, assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { sendResetPasswordMail } from "../../src/utils/emailSender.ts";
import ResetPasswordToken from "../../src/models/ResetPasswordToken.ts";

Deno.test("sendResetPasswordMail - Sends an email with correct content", async () => {
	const sandbox = sinon.createSandbox();

	try {
		const sendMailMock = sandbox.stub().resolves();
		const createJwtTokenMock = sandbox.stub().resolves("fake_token");
		const generateTemplateMock = sandbox.stub().returns("email content");
		const resetPasswordTokenCreateStub = sandbox.stub(ResetPasswordToken, "create").resolves();

		const email = "test@example.com";
		await sendResetPasswordMail(email);

		assert(sendMailMock.calledOnceWithExactly, "Skicka funktionen ska ha anropats");
		assert(
			createJwtTokenMock.calledOnceWithExactly,
			"JWT-token skaparfunktionen ska ha anropats"
		);
		assert(
			generateTemplateMock.calledOnceWithExactly,
			"E-postmallgenereringsfunktionen ska ha anropats"
		);
		sinon.assert.calledOnceWithExactly(resetPasswordTokenCreateStub, {
			email: email,
			token: sinon.match.string,
		});
	} finally {
		sandbox.restore();
	}
});
