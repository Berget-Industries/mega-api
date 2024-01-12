import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();
router.get("/ping", (ctx: Context) => {
	try {
		handleResponseSuccess(ctx, { status: "success", message: "Online" });
	} catch (error) {
		handleResponseError(ctx, { status: "internal-error", message: "An error occurred", error });
	}
});

export default router;
