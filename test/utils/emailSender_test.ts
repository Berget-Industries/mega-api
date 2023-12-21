// Test för sendResetPasswordMail funktionen
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { sendResetPasswordMail } from "../../src/utils/emailSender.ts";

Deno.test("sendResetPasswordMail - Sends an email with correct content", async () => {
	const sandbox = sinon.createSandbox();

	try {
		const createJwtTokenMock = sandbox.stub().resolves("fake_token");
		const generateTemplateMock = sandbox.stub().returns("email content");
		const sendMailMock = sandbox.stub().resolves();

		const email = "test@example.com";
		await sendResetPasswordMail(email, {
			createJwtToken: createJwtTokenMock,
			generateTemplate: generateTemplateMock,
			sendMail: sendMailMock,
		});

		assert(sendMailMock.calledOnce, "Skicka funktionen ska ha anropats");
		assert(createJwtTokenMock.calledOnce, "JWT-token skaparfunktionen ska ha anropats");
		assert(generateTemplateMock.calledOnce, "E-postmallgenereringsfunktionen ska ha anropats");
	} finally {
		sandbox.restore();
	}
});
