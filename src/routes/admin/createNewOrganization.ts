import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Organization } from "../../models/index.ts";

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
				conversations: [],
				messages: [],
			});

			const body = { organization: organizationDoc.toObject() };
			handleResponseSuccess(ctx, body);
		} catch (error) {
			console.error(error);
			const body = "internal server error";
			handleResponseError(ctx, body);
		}
	}
);

export default router;
