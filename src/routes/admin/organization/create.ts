import { Organization, User } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
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
			const { name, logoUrl, users } = await ctx.request.body().value;
			const organizationDoc = await Organization.create({
				name,
				logoUrl,
				users: [...users],
				plugins: [],
			});

			await User.updateMany(
				{ _id: { $in: users } },
				{ $push: { organizations: organizationDoc._id } }
			);

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa en organization",
				organization: organizationDoc.toObject(),
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
