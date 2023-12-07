import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { sign as jwtSign } from "npm:jsonwebtoken";
import { AiAccessKey } from "../../models/index.ts";
import { sessionStore } from "../../utils/sessionStore.ts";

const router = new Router();

router.post("/ai", async (ctx: Context) => {
	try {
		const { key } = await ctx.request.body().value;

		const keyDoc = await AiAccessKey.findOne({ key });

		if (!keyDoc) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		const token = await jwtSign(
			{ organization: keyDoc.organization, key },
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
