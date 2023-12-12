import { generateTemplate } from "./generateTemplateUtil.ts";
import { createJwtToken } from "./jwt.ts";

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

async function sendMail(to: string, subject: string, content: string) {
	const client = new SMTPClient({
		connection: {
			hostname: "smtp.gmail.com",
			port: 465,
			tls: true,
			auth: {
				username: Deno.env.get("IMAP_USERNAME"),
				password: Deno.env.get("IMAP_PASSWORD"),
			},
		},
	});

	await client.send({
		from: Deno.env.get("IMAP_USERNAME"),
		to,
		subject,
		content,
	});
	await client.close();
}

export const sendResetPasswordMail = async (email: string): Promise<void> => {
	const token = await createJwtToken({ data: email, type: "reset-password" });
	const subject = "Återställ lösenord";

	const content = generateTemplate(token);

	await sendMail(email, subject, content);
};
