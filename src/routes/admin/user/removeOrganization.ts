import { User, Organization } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/remove-organization",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { userId, organizationId } = await ctx.request.body().value;

			if (!userId || !organizationId) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Användar-id och/eller organisation-id saknas.",
				});
				return;
			}

			const user = await User.findOne({ _id: userId });
			if (!user) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Användaren kunde inte hittas.",
				});
				return;
			}

			const organization = await Organization.findOne({ _id: organizationId });
			if (!organization) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Organisationen kunde inte hittas.",
				});
				return;
			}

			if (
				!user.organizations.includes(organizationId) &&
				!organization.users.includes(userId)
			) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Användaren är inte medlem i organisationen.",
				});
				return;
			}

			await Organization.findByIdAndUpdate(organizationId, { $pull: { users: userId } });

			const newUser = await User.findByIdAndUpdate(
				userId,
				{
					$pull: { organizations: organizationId },
				},
				{ new: true }
			);

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades lägga till organisation till användare.",
				user: newUser?.toObject(),
			});
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
