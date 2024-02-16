import { Plugin, Organization } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { globalEventTarget } from "../../../utils/globalEventTarget.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { getAvailablePlugins, findPlugin } from "../../../utils/getAvailablePlugins.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/import-config",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organizationId, name, config } = await ctx.request.body().value;

			if (!name || !config || !organizationId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId, name, config. Kan inte aktivera plugin.",
				});
				return;
			}

			const organizationDoc = await Organization.findById(organizationId);
			if (!organizationDoc) {
				handleResponsePartialContent(ctx, {
					status: "organization-not-found",
					message: "Organizationen existerar inte.",
				});
				return;
			}

			const foundDefaultPlugin = findPlugin(name);
			if (!foundDefaultPlugin) {
				handleResponsePartialContent(ctx, {
					status: "plugin-not-found",
					message: "Pluginet existerar inte.",
				});
				return;
			}

			const { dependencies, type, defaultConfig } = foundDefaultPlugin;

			if (type !== "input") {
				const foundPlugin = await Plugin.findOne({ name, organization: organizationId });
				if (foundPlugin) {
					handleResponsePartialContent(ctx, {
						status: "already-exciting",
						message: "Det går endast att ha en instans av detta plugin.",
					});
					return;
				}
			}

			const defaultConfigKeys = Object.keys(defaultConfig);
			const configKeys = Object.keys(config);

			if (defaultConfigKeys.length !== configKeys.length) {
				handleResponsePartialContent(ctx, {
					status: "invalid-config",
					message: "Konfigurationen är ogiltig. Felaktigt antal nycklar.",
				});
				return;
			}

			if (!defaultConfigKeys.every((key) => configKeys.includes(key))) {
				handleResponsePartialContent(ctx, {
					status: "invalid-config",
					message: "Konfigurationen är ogiltig. Saknar nödvändiga nycklar.",
				});
				return;
			}

			const isConfigValid = defaultConfigKeys.every((key) => {
				const defaultValue = defaultConfig[key];
				const configValue = config[key];
				return typeof configValue === typeof defaultValue;
			});

			if (!isConfigValid) {
				handleResponsePartialContent(ctx, {
					status: "invalid-config",
					message: "Konfigurationen är ogiltig. Felaktiga värden för nycklar.",
				});
				return;
			}

			const newPlugin = await Plugin.create({
				organization: organizationId,
				dependencies,
				config,
				name,
				type,
			});

			await Organization.findByIdAndUpdate(organizationId, {
				$addToSet: { plugins: newPlugin._id },
			});

			if (name === "mailer") {
				globalEventTarget.dispatchEvent(
					new CustomEvent("update-plugins-mailer", {
						detail: newPlugin._id,
					})
				);
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa ett nytt plugin.",
				plugin: newPlugin.toObject(),
			});
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Ett internt fel har uppstått.",
			});
		}
	}
);

export default router;
