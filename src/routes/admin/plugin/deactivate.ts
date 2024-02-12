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
	"/deactivate",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { pluginId } = await ctx.request.body().value;
			if (!pluginId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message: "Saknar någon av dessa nycklar: pluginId. Kan inte avaktivera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findById(pluginId);
			if (!foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "not-found",
					message:
						"Detta plugin existerar inte på denna organization. Kunde inte avaktivera.",
				});
				return;
			}

			if (foundPlugin.name === "auto-filter") {
				console.log("auto-filter1");
				await Plugin.updateMany(
					{
						organization: foundPlugin.organization,
						name: "mailer",
					},
					{ $set: { "config.autoFilter": false } }
				);

				const megaAssistantAlexPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "mega-assistant-alex",
				});

				if (!megaAssistantAlexPlugin || !megaAssistantAlexPlugin.isActivated) {
					console.log("mega-assistant-alex2");
					await Plugin.updateMany(
						{
							organization: foundPlugin.organization,
							name: "mailer",
						},
						{ isActivated: false }
					);
				}
			}

			if (foundPlugin.name === "mega-assistant-alex") {
				console.log("mega-assistant-alex1");
				const autoFilterPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "auto-filter",
				});

				if (!autoFilterPlugin || !autoFilterPlugin.isActivated) {
					console.log("auto-filter2");
					await Plugin.updateMany(
						{
							organization: foundPlugin.organization,
							name: "mailer",
						},
						{ isActivated: false }
					);
				}
			}

			foundPlugin.isActivated = false;
			await foundPlugin.save();

			if (foundPlugin.name === "mailer") {
				globalEventTarget.dispatchEvent(new Event("update-plugins-mailer"));
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades avaktivera ett nytt plugin.",
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
