import { AiAccessKey } from "../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

function uuidv4() {
	return "xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

const router = new Router();
router.post(
	"/createNewAiAccessKey",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organization } = await ctx.request.body().value;
			const key = uuidv4();
			const aiAccessKey = await AiAccessKey.create({
				organization,
				key,
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
