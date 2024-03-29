export const systemPrompt = () => `
{organizationSystemMessage}
`;

export const getChatPrompt = () => `
Du ska skriva ett meddelande till {contactName}.

INFORMATION OM PERSONEN DU SKA KONTAKTA:
{contactInformation}
`;
