import { User } from "../../models/index.ts";
import { sendResetPasswordMail } from "../../utils/emailSender.ts";
import { Context, Router } from "https://deno.land/x/oak/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/requestResetPasswordToken", async (ctx: Context) => {
	try {
		const { email } = await ctx.state.session.user;
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
			status: "success",
			message: "Återställningslänken för lösenordet har skickats.",
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
