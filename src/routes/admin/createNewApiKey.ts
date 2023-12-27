import { ApiKey } from "../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../utils/contextHandler.ts";
import uuidv4 from "../../utils/generateAccessToken.ts";

const router = new Router();
router.post(
	"/createNewApiKey",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organization } = await ctx.request.body().value;
			if (!organization) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message: "Saknar organization. Kan inte skapa nyckel.",
				});
				return;
			}

			const key = uuidv4();
			const apiKey = await ApiKey.create({
				organization,
				key,
			});

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa en access key.",
				apiKey: apiKey.toObject(),
			});
		} catch (error) {
			console.error(error);
			const body = "internal server error";
			handleResponseError(ctx, body);
		}
	}
);

export default router;
