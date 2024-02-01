import { User, Organization } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/remove",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { userId } = await ctx.request.body().value;
			const deletedUser = await User.findByIdAndDelete(userId);

			if (!deletedUser) {
				handleResponseSuccess(ctx, {
					status: "user-not-found",
					message: "Kunde hitta användaren.",
				});
				return;
			} else {
				await Organization.updateMany({}, { $pull: { users: userId } });

				handleResponseSuccess(ctx, {
					status: "success",
					message: "Lyckades ta bort användaren.",
					userId: deletedUser._id,
				});
				return;
			}
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Ett internt fel har uppstått.",
			});
		}
	}
);

export default router;
