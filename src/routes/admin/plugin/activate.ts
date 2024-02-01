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
			const { organizationId, name } = await ctx.request.body().value;
			if (!organizationId || !name) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId, name. Kan inte aktivera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findOne({
				organization: organizationId,
				name,
			});

			if (!foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "not-found",
					message:
						"Detta plugin existerar inte på denna organization. Kunde inte aktivera.",
				});
				return;
			}

			const allActivatedPlugins = await Plugin.find({
				organization: organizationId,
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

			if (name === "mailer") {
				globalEventTarget.dispatchEvent(new Event("update-plugins-mailer"));
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
