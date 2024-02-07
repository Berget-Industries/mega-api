import { Plugin } from "../models/index.ts";

export default async function getPluginConfig(pluginName: string, organizationId: string) {
	if (!organizationId) {
		console.log("Organisationens id saknas.");
		return undefined;
	}

	if (!pluginName) {
		console.log("Pluginet saknas.");
		return undefined;
	}

	const pluginDoc = await Plugin.findOne({
		organization: organizationId,
		name: pluginName,
	});

	if (!pluginDoc) {
		console.log(`Pluginet kunde inte hittas: ${pluginName} (${organizationId})`);
		return undefined;
	}

	if (pluginDoc.isActivated) {
		return pluginDoc.config;
	} else {
		return undefined;
	}
}
