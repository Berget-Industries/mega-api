import { SystemMessage } from "npm:langchain@^0.0.159/schema";

export const getSystemMessage = (organizationSystemMessage: string) =>
	new SystemMessage(`${organizationSystemMessage}`);
