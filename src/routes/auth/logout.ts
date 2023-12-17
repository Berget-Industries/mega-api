import sessionStore from "../../utils/sessionStore.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/logout", authenticationMiddleware, async (ctx: Context) => {
	try {
		const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");
		if (token) {
			await sessionStore.deleteSession(token);
		}

		const body = { message: "Logged out successfully" };
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		const body = { message: "Internal Server Error" };
		handleResponseError(ctx, body);
	}
});

export default router;
