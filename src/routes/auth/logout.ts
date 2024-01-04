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

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades logga ut.",
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Ett internt fel har uppstått.",
		});
	}
});

export default router;
