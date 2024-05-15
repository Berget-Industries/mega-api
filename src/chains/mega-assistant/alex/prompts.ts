import { ChatPromptTemplate, MessagesPlaceholder } from "npm:@langchain/core/prompts";

const getSystemMessageString = `
==============================

{organizationSystemPrompt}

==============================

DU KAN GÖRA FÖLJNADE:
{organizationAbilities}

==============================

HISTORIK FÖR KONVERSATIONEN:
{alex_memory}

==============================

`;

export const getPrompt = () =>
	ChatPromptTemplate.fromMessages([
		["system", getSystemMessageString],
		["human", "{input}"],
		new MessagesPlaceholder("agent_scratchpad"),
	]);
