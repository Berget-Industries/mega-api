import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import { hostname } from "https://deno.land/std@0.122.0/node/os.ts";

const router = new Router();

router.get("/ping", (ctx: Context) => {
	try {
		handleResponseSuccess(ctx, { status: "success", message: "Online", host: hostname() });
	} catch (error) {
		console.log(error);
		handleResponseError(ctx, { status: "internal-error", message: "An error occurred", error });
	}
});

export default router;
