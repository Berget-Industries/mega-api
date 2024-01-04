import { generateTemplate } from "./generateTemplateUtil.ts";
import { createJwtToken } from "./jwt.ts";
import ResetPasswordToken from "../models/ResetPasswordToken.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

async function sendMail(to: string, subject: string, html: string) {
	const username = Deno.env.get("IMAP_USERNAME");
	const password = Deno.env.get("IMAP_PASSWORD");

	if (!username || !password) {
		throw new Error("IMAP_USERNAME, IMAP_PASSWORD not set.");
	}

	const client = new SMTPClient({
		connection: {
			hostname: "smtp.gmail.com",
			port: 465,
			tls: true,
			auth: {
				username,
				password,
			},
		},
	});

	await client.send({
		from: username,
		to,
		subject,
		html,
	});
	await client.close();
}

export const sendResetPasswordMail = async (email: string): Promise<void> => {
	const token = await createJwtToken({ data: email, type: "reset-password" });
	const subject = "Återställ lösenord";

	const html = generateTemplate(token);

	await ResetPasswordToken.create({ email: email, token: token });

	await sendMail(email, subject, html);
};
