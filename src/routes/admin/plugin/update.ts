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
	"/update",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { pluginId, config } = await ctx.request.body().value;

			if (!pluginId || !config) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: pluginId config. Kan inte uppdatera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findById(pluginId);
			if (!foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "not-found",
					message:
						"Detta plugin existerar inte på denna organization. Kunde inte uppdatera.",
				});
				return;
			}

			if (foundPlugin.name === "mailer" && config.autoFilter && foundPlugin.isActivated) {
				const autoFilterPlugin = await Plugin.findOne({
					organization: foundPlugin.organization,
					name: "auto-filter",
				});

				if (!autoFilterPlugin || !autoFilterPlugin.isActivated) {
					handleResponsePartialContent(ctx, {
						status: "missing-dependencies",
						message: "Mailer pluginet saknar auto-filter, kan inte uppdatera plugin.",
					});
					return;
				}
			}

			await Plugin.findByIdAndUpdate(pluginId, { $set: { config } }, { new: true });

			if (foundPlugin.name === "mailer") {
				globalEventTarget.dispatchEvent(
					new CustomEvent("update-plugins-mailer", {
						detail: foundPlugin._id,
					})
				);
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades uppdatera ett plugin.",
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
