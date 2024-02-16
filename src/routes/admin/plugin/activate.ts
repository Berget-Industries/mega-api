import { Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { globalEventTarget } from "../../../utils/globalEventTarget.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/activate",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { pluginId } = await ctx.request.body().value;
			if (!pluginId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message: "Saknar någon av dessa nycklar: pluginId Kan inte aktivera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findById(pluginId);

			if (!foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "not-found",
					message:
						"Detta plugin existerar inte på denna organization. Kunde inte aktivera.",
				});
				return;
			}

			if (foundPlugin.name === "mailer") {
				if (foundPlugin.config.autoFilter) {
					const autoFilterPlugin = await Plugin.findOne({
						organization: foundPlugin.organization,
						name: "auto-filter",
					});

					if (!autoFilterPlugin || !autoFilterPlugin.isActivated) {
						handleResponsePartialContent(ctx, {
							status: "missing-dependencies",
							message: "Mailer pluginet saknar autoFilter, kan inte aktivera plugin.",
						});
						return;
					}
				} else {
					const megaAssistantAlexPlugin = await Plugin.findOne({
						organization: foundPlugin.organization,
						name: "mega-assistant-alex",
					});

					if (!megaAssistantAlexPlugin || !megaAssistantAlexPlugin.isActivated) {
						handleResponsePartialContent(ctx, {
							status: "missing-dependencies",
							message:
								"Mailer pluginet saknar mega-assistant-alex, kan inte aktivera plugin.",
						});
						return;
					}
				}
			}

			if (foundPlugin.name === "mega-assistant-eva") {
				const megaAssistantAlexPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "mega-assistant-alex",
				});

				if (!megaAssistantAlexPlugin || !megaAssistantAlexPlugin.isActivated) {
					handleResponsePartialContent(ctx, {
						status: "missing-dependencies",
						message: "Pluginet saknar mega-assistant-alex, kan inte aktivera plugin.",
					});
					return;
				}
			}

			if (foundPlugin.name.startsWith("mega-assistant-alex-")) {
				const megaAssistantAlexPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "mega-assistant-alex",
				});

				if (!megaAssistantAlexPlugin || !megaAssistantAlexPlugin.isActivated) {
					handleResponsePartialContent(ctx, {
						status: "missing-dependencies",
						message: "Pluginet saknar mega-assistant-alex, kan inte aktivera plugin.",
					});
					return;
				}
			}

			foundPlugin.isActivated = true;
			await foundPlugin.save();

			if (foundPlugin.name === "mailer") {
				globalEventTarget.dispatchEvent(
					new CustomEvent("update-plugins-mailer", {
						detail: foundPlugin._id,
					})
				);
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades aktivera ett nytt plugin.",
				plugin: foundPlugin.toObject(),
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
