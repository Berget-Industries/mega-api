// emailSender.ts
import generateResetPasswordToken from "./generateResetPasswordToken.ts";
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
	const token = await generateResetPasswordToken(email);

	const subject = "Återställ lösenord";
	const content = `Här är din nyckel för att återställa ditt lösenord! Nyckel: ${token}`;

	await sendMail(email, subject, content);
};
