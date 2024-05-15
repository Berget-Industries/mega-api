import { ChatPromptTemplate } from "npm:@langchain/core/prompts";

export const systemPromptTemplate = `
{organizationSystemMessage}
`;

export const userPromptTemplate = `
Du ska skriva ett meddelande till {contactName}.

INFORMATION OM PERSONEN DU SKA KONTAKTA:
{contactInformation}
`;

interface IPromptChainStarterTemplateInput {
	organizationSystemMessage: string;
	contactName: string;
	contactInformation: string;
}

export default async function ({
	organizationSystemMessage,
	contactName,
	contactInformation,
}: IPromptChainStarterTemplateInput): Promise<string> {
	const template = ChatPromptTemplate.fromMessages([
		["ai", systemPromptTemplate],
		["user", userPromptTemplate],
	]);

	const prompt = await template.format({
		organizationSystemMessage,
		contactName,
		contactInformation,
	});

	return prompt;
}
