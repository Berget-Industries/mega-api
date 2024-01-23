const some = {
	"A Jobb/Dränering": "Ett jobb som handlar om dränering och som är större än 750 m2.",
	"A Jobb/Grundläggning": "Ett jobb som handlar om grundläggning och som är större än 750 m2.",
	"A Jobb/Markarbete": "Ett jobb som handlar om markarbete och som är större än 750 m2.",
	"A Jobb/Snöröjning": "Ett jobb som handlar om snöröjning och som är större än 750 m2.",
	"A Jobb/Tomtplanering": "Ett jobb som handlar om somtplanering och som är större än 750 m2.",
	"A Jobb/Trägårdsanläggning":
		"Ett jobb som handlar om srägårdsanläggning och som är större än 750 m2.",
	"B Jobb/Dränering":
		"Ett jobb som handlar om dränering och som är större än 500 m2 och mindre än 750 m2.",
	"B Jobb/Grundläggning":
		"Ett jobb som handlar om grundläggning och som är större än 500 m2 och mindre än 750 m2.",
	"B Jobb/Markarbete":
		"Ett jobb som handlar om markarbete och som är större än 500 m2 och mindre än 750 m2.",
	"B Jobb/Snöröjning":
		"Ett jobb som handlar om snöröjning och som är större än 500 m2 och mindre än 750 m2.",
	"B Jobb/Tomtplanering":
		"Ett jobb som handlar om somtplanering och som är större än 500 m2 och mindre än 750 m2.",
	"B Jobb/Trägårdsanläggning":
		"Ett jobb som handlar om srägårdsanläggning och som är större än 500 m2 och mindre än 750 m2.",
	"C Jobb/Dränering":
		"Ett jobb som handlar om dränering och som är större än 250 m2 och mindre än 500 m2.",
	"C Jobb/Grundläggning":
		"Ett jobb som handlar om grundläggning och som är större än 250 m2 och mindre än 500 m2.",
	"C Jobb/Markarbete":
		"Ett jobb som handlar om markarbete och som är större än 250 m2 och mindre än 500 m2.",
	"C Jobb/Snöröjning":
		"Ett jobb som handlar om snöröjning och som är större än 250 m2 och mindre än 500 m2.",
	"C Jobb/Tomtplanering":
		"Ett jobb som handlar om somtplanering och som är större än 250 m2 och mindre än 500 m2.",
	"C Jobb/Trägårdsanläggning":
		"Ett jobb som handlar om srägårdsanläggning och som är större än 250 m2 och mindre än 500 m2.",
	"D Jobb/Dränering": "Ett jobb som handlar om dränering och som är mindre än 250 m2.",
	"D Jobb/Grundläggning": "Ett jobb som handlar om grundläggning och som är mindre än 250 m2.",
	"D Jobb/Markarbete": "Ett jobb som handlar om markarbete och som är mindre än 250 m2.",
	"D Jobb/Snöröjning": "Ett jobb som handlar om snöröjning och som är mindre än 250 m2.",
	"D Jobb/Tomtplanering": "Ett jobb som handlar om somtplanering och som är mindre än 250 m2.",
	"D Jobb/Trägårdsanläggning":
		"Ett jobb som handlar om srägårdsanläggning oDh som är mindre än 250 m2.",
};

export const systemPrompt = (organizationRules: Record<string, string>) => `
Du är en expert på att sortera mail. Din uppgift är att sortera mail.
Du kommer att få ett meddelande av användaren och du ska endast berätta var meddelandet ska ta vägen, hur det sak sorteras.


FORMAT FÖR REGLER:
- SORTERINGS-NYCKEL: FÖRKLARING
Reglerna är en lista som innehåller nycklar och värden.
Namnet på nyckeln är själva sorterings nyckeln som du ska svara med för att välja just den sorteringen.
Värdet till nyckeln i listan är förklaringen till när du ska använda just den nyckeln, vilka krav som krävs för att meddelandet ska passa den sorteringsnyckel.

REGLER FÖR SORTERING:
${Object.entries(organizationRules)
	.map(([key, value]) => `- ${key}: ${value}`)
	.join("\n")}

Du ska endast svara ett ord. Vilken sorterings som ska ske. Du ska endast skriva sorterings nyckeln.
SVARA ALLTID I FÖLJANDE FORMAT:
(SORTERINGS-NYCKEL)

{organizationExamples}
`;

export const getChatPrompt = () => `
Meddelande:
{message}
`;
