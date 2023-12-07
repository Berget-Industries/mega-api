import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { sendResetPasswordMail } from "../../utils/emailSender.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { User } from "../../models/index.ts";

const router = new Router();

router.post("/requestPasswordChange", async (ctx: Context) => {
	try {
		const { email } = await ctx.request.body().value;

		const userDoc = await User.findOne({ email });

		if (!userDoc) {
			const body = "invalid ID";
			handleResponseError(ctx, body);
			return;
		}

		await sendResetPasswordMail(userDoc.email);

		const body = { message: "Password reset email sent" };
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		const body = "Failed to send password reset email";
		handleResponseError(ctx, body);
	}
});

export default router;
