import { Plugin, Worker } from "../../../models/index.ts";
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
				const megaAssistantAlexPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "mega-assistant-alex",
				});

				if (!megaAssistantAlexPlugin || !megaAssistantAlexPlugin.isActivated) {
					await Plugin.updateMany(
						{
							organization: foundPlugin.organization,
							name: "mailer",
						},
						{ isActivated: false, worker: null }
					);
				} else {
					await Plugin.updateMany(
						{
							organization: foundPlugin.organization,
							name: "mailer",
						},
						{ $set: { "config.autoFilter": false } }
					);
				}
			}

			if (foundPlugin.name === "mega-assistant-alex") {
				console.log("mega-assistant-alex1");

				await Plugin.updateMany(
					{
						organization: foundPlugin.organization,
						name: "mailer",
						"config.autoFilter": false,
					},
					{ isActivated: false, worker: null }
				);

				await Plugin.updateOne(
					{
						organization: foundPlugin.organization,
						name: "mega-assistant-eva",
					},
					{ isActivated: false }
				);

				await Plugin.updateMany(
					{
						organization: foundPlugin.organization,
						name: { $regex: /^mega-assistant-alex-/ },
					},
					{ isActivated: false }
				);
			}

			if (foundPlugin.worker) {
				await Worker.findByIdAndUpdate(foundPlugin.worker, {
					$pull: { plugins: foundPlugin._id },
				});
			}

			foundPlugin.worker = null;
			foundPlugin.isActivated = false;
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
