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
router.get(
	"/list",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const organizationId = ctx.request.url.searchParams.get("organizationId");

			if (!organizationId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId. Kan inte hitta plugin.",
				});
				return;
			}

			const foundPlugins = await Plugin.find({
				organization: organizationId,
			})
				.select("-__v")
				.exec();

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades aktivera ett nytt plugin.",
				plugins: foundPlugins,
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
