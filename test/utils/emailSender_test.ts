// Test för sendResetPasswordMail funktionen
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { sendResetPasswordMail } from "../../src/utils/emailSender.ts"; // Ersätt med sökvägen till din modul
import { createJwtToken } from "../../src/utils/jwt.ts";
import { generateTemplate } from "../../src/utils/generateTemplateUtil.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const sandbox = sinon.createSandbox();

Deno.test("sendResetPasswordMail - Sends an email with correct content", async () => {
	try {
		// Stubba SMTPClient och dess metoder
		const sendStub = sandbox.stub(SMTPClient.prototype, "send").resolves();
		const closeStub = sandbox.stub(SMTPClient.prototype, "close").resolves();

		// Stubba createJwtToken och generateTemplate
		const tokenStub = sandbox.stub(createJwtToken, "createJwtToken").resolves("fake_token");
		const templateStub = sandbox
			.stub(generateTemplate, "generateTemplate")
			.returns("email content");

		const email = "test@example.com";
		await sendResetPasswordMail(email);

		assert(sendStub.calledOnce, "Skicka funktionen ska anropas en gång");
		assertEquals(sendStub.firstCall.args[0].to, email, "E-postadressen ska vara korrekt");
		assertEquals(
			sendStub.firstCall.args[0].subject,
			"Återställ lösenord",
			"Ämnet ska vara korrekt"
		);
		assertEquals(
			sendStub.firstCall.args[0].content,
			"email content",
			"Innehållet ska vara korrekt"
		);

		assert(closeStub.calledOnce, "Stäng funktionen ska anropas en gång");
	} finally {
		sandbox.restore();
	}
});
