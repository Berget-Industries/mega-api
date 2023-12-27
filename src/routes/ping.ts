import { Router, Context } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router.post("/ping", (ctx: Context) => {
	try {
		ctx.response.status = 200;
		ctx.response.body = { status: "success", message: "Online" };
	} catch (error) {
		ctx.response.status = 500;
		ctx.response.body = { status: "internal-error", message: "An error occurred", error };
	}
});

export default router;
