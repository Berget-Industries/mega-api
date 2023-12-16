import { User } from "../../models/index.ts";
import { sendResetPasswordMail } from "../../utils/emailSender.ts";
import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";

const router = new Router();
router.post("/requestPasswordChange", authenticationMiddleware, async (ctx: Context) => {
	try {
		const { email } = await ctx.state.session.user.email;
		const userDoc = await User.findOne({ email });

		if (!userDoc) {
			handleResponseError(ctx, {
				status: "error",
				message: "Ogiltigt Id.",
			});
			return;
		}

		await sendResetPasswordMail(userDoc.email);

		handleResponseSuccess(ctx, {
			status: "succes",
			message: "Password reset email sent",
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "error",
			message: "Misslyckades att skicka en återställningslänk",
		});
	}
});

export default router;
