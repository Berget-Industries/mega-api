import { Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/add",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organizationId, name, type, isActivated, config } = await ctx.request.body()
				.value;

			if (!organizationId || !name || !type || isActivated === undefined || !config) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId, name, type, isActivated, config. Kan inte aktivera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findOne({ name, organization: organizationId });
			if (foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "already-exciting",
					message: "Detta plugin existerar redan på denna organization.",
				});
			}

			const newPlugin = await Plugin.create({
				organization: organizationId,
				isActivated,
				config,
				name,
				type,
			});

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
