import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { sign as jwtSign } from "npm:jsonwebtoken";
import { AiAccessKey } from "../../models/index.ts";

const router = new Router();

router.post("/ai", async (ctx: Context) => {
	try {
		const { aiAccessKey } = await ctx.request.body().value;

		const keyDoc = await AiAccessKey.findById(aiAccessKey);

		if (!keyDoc) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		const token = await jwtSign(
			{ organization: keyDoc.organization },
			Deno.env.get("JWT_SECRET") || "",
			{
				expiresIn: "2h",
			}
		);

		handleResponseSuccess(ctx, { message: "Welcome!", token });
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, "Failed to change password");
	}
});

export default router;
