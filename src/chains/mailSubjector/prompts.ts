import { ChatPromptTemplate } from "npm:@langchain/core/prompts";

export const systemPrompt = `
Du ska skriva ett ämne till ett mail.

Texten du skriver kommer att hamna på ämnes raden i mailet.
Du kommer att få läsa två meddelanden. 
Det första meddelandet är mailet som kom till din kollegas inkorg.
Det andra meddelandet är svaret din kollega skrev.

Du ska baserat på dessa två meddelanden skriva ett ämne till din kollegas mail. Ämnet ska handla om vad personen som skrev till kollegan vill.

Du ska inte svara något annat än ämnet. 
Ämnet ska vara mycket mycket kort.
`;

export const getChatPrompt = `
Kollegas nya meddelande:
{userMessage}

Kollegas svar:
{assistantMessage}
`;

interface IPromptMailSubjectorTemplateInput {
	systemMessage: string;
	userMessage: string;
	assistantMessage: string;
}

export default async function ({
	systemMessage,
	userMessage,
	assistantMessage,
}: IPromptMailSubjectorTemplateInput): Promise<string> {
	const template = ChatPromptTemplate.fromMessages([
		["ai", systemPrompt],
		["user", getChatPrompt],
	]);

	const prompt = await template.format({
		systemMessage,
		userMessage,
		assistantMessage,
	});

	return prompt;
}
