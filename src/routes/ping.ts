import { Router, Context } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();
router.post("/ping", (ctx: Context) => {
	try {
		handleResponseSuccess(ctx, { status: "success", message: "Online" });
	} catch (error) {
		handleResponseError(ctx, { status: "internal-error", message: "An error occurred", error });
	}
});

export default router;
