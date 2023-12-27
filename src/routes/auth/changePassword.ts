import * as bcrypt from "npm:bcrypt-ts";
import { verify } from "../../utils/jwt.ts";
import { User } from "../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/changePasswordWithToken", async (ctx: Context) => {
	try {
		const { newPassword, token } = await ctx.request.body().value;

		const payload = await verify(token);
		if (payload.type !== "reset-password") {
			handleResponseError(ctx, "invalid token");
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		await User.findOneAndUpdate({ email: payload.email }, { password: hashedPassword });

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Ändringen av lösenordet lyckades.",
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "error",
			message: "Något gick fel, det gick inte att ändra lösenordet.",
		});
	}
});

export default router;
