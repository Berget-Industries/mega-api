const getServerHostUrl = () => {
	const megaEnv = Deno.env.get("MEGA_ENV");

	if (megaEnv === "production") {
		return "https://twostack-system.se";
	}

	if (megaEnv === "stage") {
		return `https://dashboard.tss.stage.berget.industries`;
	}

	return "http://localhost:3000";
};

export function generateTemplate(token: string) {
	return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1>Återställ lösenord</h1>
        <p>Det verkar som att du har begärt en återställning av ditt lösenord. Du kan enkelt skapa ett nytt lösenord genom att klicka på länken nedan.</p>
        <a href="${getServerHostUrl()}/auth/jwt/register?token=${token}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Återställ lösenord</a>
        <p>Om du inte begärde en återställning, kan du ignorera detta meddelande.</p>
    </div>
    `;
}
