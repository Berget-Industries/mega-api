import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { User } from "../../models/index.ts";
import { sendResetPasswordMail } from "../../utils/emailSender.ts";

const router = new Router();

router.post(
	"/createNewUser",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { name, email, avatarUrl, organizations } = await ctx.request.body().value;

			const currentUser = await User.findOne({ email });
			if (currentUser) {
				handleResponseSuccess(ctx, "Email already exists");
				return;
			}

			const userDoc = await User.create({ name, email, avatarUrl, organizations });

			await sendResetPasswordMail(email);

			const body = { user: userDoc.toObject() };
			handleResponseSuccess(ctx, body);
		} catch (error) {
			console.error(error);
			const body = "internal server error";
			handleResponseError(ctx, body);
		}
	}
);

export default router;
