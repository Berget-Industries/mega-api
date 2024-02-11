import { ApiKey } from "../../../models/index.ts";
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
	"/remove",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { apiKeyId } = await ctx.request.body().value;

			if (!apiKeyId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message: "Saknar apiKeyId. Kan inte skapa nyckel.",
				});
				return;
			}

			const apiKey = await ApiKey.findByIdAndDelete(apiKeyId);

			if (!apiKey) {
				handleResponsePartialContent(ctx, {
					status: "invalid-id",
					message: "Kunde inte hitta api nyckeln.",
				});
				return;
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades ta bort api nyckeln.",
				apiKey: apiKey.toObject(),
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
