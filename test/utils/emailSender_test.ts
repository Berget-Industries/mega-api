// Test för sendResetPasswordMail funktionen
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { sendResetPasswordMail } from "../../src/utils/emailSender.ts";

Deno.test("sendResetPasswordMail - Sends an email with correct content", async () => {
	const sandbox = sinon.createSandbox();

	try {
		const sendMailMock = sandbox.stub().resolves();
		const createJwtTokenMock = sandbox.stub().resolves("fake_token");
		const generateTemplateMock = sandbox.stub().returns("email content");

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
	} finally {
		sandbox.restore();
	}
});
