import { Types } from "npm:mongoose";
import { User, Organization } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { sendResetPasswordMail } from "../../../utils/emailSender.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/create",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { name, email, avatarUrl, organizations } = await ctx.request.body().value;

			const currentUser = await User.findOne({ email });
			if (currentUser) {
				handleResponseSuccess(ctx, {
					status: "bad-request",
					message: "En användare med samma email finns redan.",
				});
				return;
			}

			const isOnlyObjectIds = organizations.every((_id: string) => {
				return Types.ObjectId.isValid(_id);
			});

			if (!isOnlyObjectIds) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "En eller flera organisationer har fel format.",
				});
				return;
			}

			const allOrganizations = await Organization.find({ _id: { $in: organizations } });
			console.log(allOrganizations.length, organizations.length);
			if (allOrganizations.length !== organizations.length) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "En eller flera organisationer kunde inte hittas.",
				});
				return;
			}

			const userDoc = await User.create({ name, email, avatarUrl, organizations });

			await Organization.updateMany(
				{ _id: { $in: organizations } },
				{ $push: { users: userDoc._id } }
			);

			await sendResetPasswordMail(email);

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa en användare.",
				// user: userDoc.toObject(),
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
