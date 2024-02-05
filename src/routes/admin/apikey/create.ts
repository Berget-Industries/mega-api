import { ApiKey } from "../../../models/index.ts";
import uuidv4 from "../../../utils/generateAccessToken.ts";
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
	"/create",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organization, systemKey } = await ctx.request.body().value;
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
				systemKey,
				key,
			});

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa en access key.",
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
