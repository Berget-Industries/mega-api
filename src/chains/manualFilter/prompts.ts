export const systemPrompt = (organizationSystemPrompt: string) => `
Du kommer att få läsa igen ett meddelande.
${organizationSystemPrompt}

Baserat på listan med uppgifter, kan du hjälpa till med ärendet eller inte?
Svara NEJ! om du kan hjälpa till. Svara JA! om ärendet ska hanteras manuellt av annan person.

DU FÅR ENDAST SVARA JA ELLER NEJ.
SVARA ALLTID I DETTA FORMAT:
JA!
eller
NEJ!
`;
