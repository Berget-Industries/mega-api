import { Organization, Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/deactivate-plugins",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organization } = await ctx.request.body().value;

			if (!organization) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Saknar organization.",
				});
				return;
			}

			const organizationDoc = await Organization.findById(organization);
			if (!organizationDoc) {
				handleResponseError(ctx, {
					status: "not-found",
					message: "Organizationen hittades inte.",
				});
				return;
			}

			await Plugin.updateMany({ organization: organizationDoc._id }, { isActivated: false });

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Alla plugins avaktiverades.",
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
