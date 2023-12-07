import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();

router.get("/me", authenticationMiddleware, async (ctx: Context) => {
	const body = {
		user: ctx.state.session.user,
	};
	handleResponseSuccess(ctx, body);
});

export default router;
