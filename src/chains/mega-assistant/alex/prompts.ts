import { SystemMessage } from "npm:langchain@^0.0.159/schema";

type getSystemMessageInput = {
	organizationSystemPrompt: string;
	organizationAbilities: string;
};

export const getSystemMessage = ({
	organizationSystemPrompt,
	organizationAbilities,
}: getSystemMessageInput) =>
	new SystemMessage(`
==============================

${organizationSystemPrompt}

==============================

DU KAN GÖRA FÖLJNADE:
${organizationAbilities}

==============================
`);
