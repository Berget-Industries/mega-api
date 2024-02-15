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

			const allActivatedPlugins = await Plugin.find({
				organization: foundPlugin.organization,
				dependencies: { $in: foundPlugin.name },
				isActivated: true,
			});

			const doesAllDependenciesExist =
				foundPlugin.dependencies.length === allActivatedPlugins.length;

			if (!doesAllDependenciesExist) {
				handleResponsePartialContent(ctx, {
					status: "missing-dependencies",
					message: "Organizationen saknar anda plugins, kan inte lägga till plugin.",
				});
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
