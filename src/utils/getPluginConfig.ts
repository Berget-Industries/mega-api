import { Organization } from "../models/index.ts";

export default async function getPluginConfig(pluginName: string, organizationId: string) {
	if (!organizationId) {
		throw new Error("Organisationens id saknas.");
	}

	if (!pluginName) {
		throw new Error("Pluginet saknas.");
	}

	const organizationDoc = await Organization.findById(organizationId);
	if (!organizationDoc) {
		throw new Error("Kunde inte hitta organisation.");
	}

	const plugin = organizationDoc.plugins.find((_) => _.name === pluginName);
	if (!plugin) {
		throw new Error("Pluginet kunde inte hittas.");
	}

	if (plugin.activated === true) {
		return plugin.config;
	} else {
		return undefined;
	}
}
