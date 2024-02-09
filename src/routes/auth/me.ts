import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Organization, User } from "../../models/index.ts";

const router = new Router();
router.get("/me", authenticationMiddleware, async (ctx: Context) => {
	let user = await User.findById(ctx.state.session.user._id)
		.populate({
			path: "organizations",
			select: "-users -__v",
		})
		.exec();

	if (!user) {
		return handleResponseError(ctx, {
			status: "error",
			message: "Kunde inte hitta användare.",
		});
	}

	if (user.systemAdmin) {
		const allOrganizations = await Organization.find({});
		const organizations = allOrganizations.map((_) => _.toObject());
		const adminUser = { ...user.toObject(), organizations };

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hämta nuvarande användare.",
			user: adminUser,
		});

		return;
	}

	handleResponseSuccess(ctx, {
		status: "success",
		message: "Lyckades hämta nuvarande användare.",
		user: user.toObject(),
	});
});

export default router;
