import sendToHuman from "./sendToHuman.ts";

interface IPluginInitMailE {
	tags: string[];
	config: {
		sendTo: string;
		subject: string;
		nameOfHuman: string;
		description: string;
		subjectForStats: string;
	};
	conversationId: string;
	organizationId: string;
	pluginId: string;
}

export default function initMailE({
	tags,
	config,
	conversationId,
	organizationId,
	pluginId,
}: IPluginInitMailE) {
	return [sendToHuman({ config, pluginId, conversationId, organizationId, tags })];
}

export const initPluginMailESendToHuman = ({
	tags,
	config,
	conversationId,
	organizationId,
	pluginId,
}: IPluginInitMailE) => [sendToHuman({ config, pluginId, conversationId, organizationId, tags })];
