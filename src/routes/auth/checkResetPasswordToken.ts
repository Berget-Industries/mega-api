import { verify } from "../../utils/jwt.ts";
import { User } from "../../models/index.ts";
import ResetPasswordToken from "../../models/ResetPasswordToken.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/check-reset-password-token", async (ctx: Context) => {
	try {
		const { token } = await ctx.request.body().value;

		const payload = await verify(token);
		if (payload.type !== "reset-password") {
			handleResponseError(ctx, {
				status: "error",
				message: "Ogiltig token",
			});
			return;
		}

		const tokenDoc = await ResetPasswordToken.findOne({ token });
		if (!tokenDoc) {
			handleResponseError(ctx, {
				status: "error",
				message: "Ogiltig token",
			});
			return;
		}

		const user = await User.findOne({ email: payload.data });
		if (!user) {
			handleResponseError(ctx, {
				status: "error",
				message: "Användaren kunde inte hittas.",
			});
			return;
		}

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Token är giltig",
			user,
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "server-error",
			message: "Internal server error.",
		});
	}
});

export default router;
