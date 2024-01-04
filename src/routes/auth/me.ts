import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.get("/me", authenticationMiddleware, async (ctx: Context) => {
	handleResponseSuccess(ctx, {
		status: "success",
		message: "Lyckades hämta nuvarande användare.",
		user: ctx.state.session.user,
	});
});

export default router;
