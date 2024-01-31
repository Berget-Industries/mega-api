import { Organization } from "../../../models/index.ts";
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
			const { organizationId } = await ctx.request.body().value;
			const organizationDoc = await Organization.findByIdAndDelete(organizationId);

			if (!organizationDoc) {
				handleResponseError(ctx, {
					status: "not-found",
					message: "Kunde inte hitta en organization med det angivna id:t",
				});
				return;
			} else {
				handleResponseSuccess(ctx, {
					status: "success",
					message: "Lyckades ta bort organisationen.",
					organization: organizationDoc._id,
				});
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
