import { Plugin } from "../models/index.ts";

export default async function getPluginConfig(pluginName: string, organizationId: string) {
	if (!organizationId) {
		throw new Error("Organisationens id saknas.");
	}

	if (!pluginName) {
		throw new Error("Pluginet saknas.");
	}

	const pluginDoc = await Plugin.findOne({
		organization: organizationId,
		name: pluginName,
	});

	if (!pluginDoc) {
		throw new Error(`Pluginet kunde inte hittas: ${pluginName} (${organizationId})`);
	}

	if (pluginDoc.isActivated) {
		return pluginDoc.config;
	} else {
		return undefined;
	}
}
