import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { AiAccessKey } from "../../models/index.ts";

const router = new Router();

router.post(
	"/createNewAiAccessKey",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organization } = await ctx.request.body().value;

			const aiAccessKey = await AiAccessKey.create({
				organization,
			});

			const body = { aiAccessKey: aiAccessKey.toObject() };
			handleResponseSuccess(ctx, body);
		} catch (error) {
			console.error(error);
			const body = "internal server error";
			handleResponseError(ctx, body);
		}
	}
);

export default router;
