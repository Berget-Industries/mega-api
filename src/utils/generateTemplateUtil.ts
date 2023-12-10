export function generateTemplate(token: string) {
	const style = `
        <style>
            .container {
                font-family: Arial, sans-serif; 
                text-align: center;
            }
            .reset-link {
                display: inline-block; 
                padding: 10px 20px; 
                margin: 20px 0; 
                background-color: #007bff; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px;
            }
        </style>
    `;

	return `
    <div class="container">
        ${style}
        <h1>Återställ lösenord</h1>
        <p>Det verkar som att du har begärt en återställning av ditt lösenord. Du kan enkelt skapa ett nytt lösenord genom att klicka på länken nedan.</p>
        <a href="https://youtube.com/${token}" class="reset-link">Återställ lösenord</a>
        <p>Om du inte begärde en återställning, kan du ignorera detta meddelande.</p>
    </div>
    `;
}
