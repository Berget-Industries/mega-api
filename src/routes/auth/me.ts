import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import User from "../../models/User.ts";

const router = new Router();
router.get("/me", authenticationMiddleware, async (ctx: Context) => {
	const user = await User.findById(ctx.state.session.user._id).populate({
		path: "organizations",
		select: "-users -__v",
	});
	if (!user) {
		return null;
	}
	handleResponseSuccess(ctx, {
		status: "success",
		message: "Lyckades hämta nuvarande användare.",
		user: user.toObject(),
	});
});

export default router;
