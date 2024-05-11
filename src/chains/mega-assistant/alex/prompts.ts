import { SystemMessage } from "npm:langchain@latest/schema";
import { ChatPromptTemplate } from "npm:langchain@latest/prompts";

type getSystemMessageInput = {
	organizationSystemPrompt: string;
	organizationAbilities: string;
};

const getSystemMessageString = ({
	organizationSystemPrompt,
	organizationAbilities,
}: getSystemMessageInput) =>
	`
==============================

${organizationSystemPrompt}

==============================

DU KAN GÖRA FÖLJNADE:
${organizationAbilities}

==============================

HISTORIK FÖR KONVERSATIONEN:
{history}

==============================

`;

export const getSystemMessage = (_: getSystemMessageInput) =>
	new SystemMessage(getSystemMessageString(_));

export const getPrompt = (_: getSystemMessageInput) =>
	ChatPromptTemplate.fromMessages([
		["system", getSystemMessageString(_)],
		["human", "{input}"],
		["ai", "{agent_scratchpad}"],
	]);
