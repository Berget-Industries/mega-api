import { Plugin, IPlugin } from "../models/Plugin.ts";
export async function getPluginConfig(pluginName: string, organizationId: string) {
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

export default getPluginConfig;

export async function getAlexPlugins(organizationId: string) {
	const pluginDocs = await Plugin.find({
		organization: organizationId,
		isActivated: true,
		name: {
			$regex: /^mega-assistant-alex-/,
		},
	});

	const pluginConfigs = pluginDocs.map((pluginDoc) => {
		return pluginDoc.toObject() as IPlugin;
	});

	return pluginConfigs;
}
