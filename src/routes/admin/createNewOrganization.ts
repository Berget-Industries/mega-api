import { Organization } from "../../models/index.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/createNewOrganization",
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
