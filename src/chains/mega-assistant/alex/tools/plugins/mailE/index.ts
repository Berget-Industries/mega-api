import sendToHuman from "./sendToHuman.ts";

interface IPluginInitMailE {
	tags: string[];
	config: {
		sendTo: string;
		subject: string;
		nameOfHuman: string;
		description: string;
	};
	conversationId: string;
	organizationId: string;
}

export default function initMailE({
	tags,
	config,
	conversationId,
	organizationId,
}: IPluginInitMailE) {
	return [sendToHuman({ config, conversationId, organizationId, tags })];
}

export const initPluginMailESendToHuman = ({
	tags,
	config,
	conversationId,
	organizationId,
}: IPluginInitMailE) => [sendToHuman({ config, conversationId, organizationId, tags })];
