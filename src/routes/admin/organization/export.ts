import { Organization, Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.get(
	"/export",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const organization = ctx.request.url.searchParams.get("organization");
			if (!organization) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Ingen organization angiven.",
				});
				return;
			}

			const organizationDoc = await Organization.findById(organization);
			if (!organizationDoc) {
				handleResponseError(ctx, {
					status: "not-found",
					message: "Organization hittades inte.",
				});
				return;
			}

			const { name, logoUrl } = organizationDoc;
			const plugins = await Plugin.find({ organization: organizationDoc._id }).select([
				"name",
				"type",
				"isActivated",
				"config",
			]);

			const exportData = {
				organization: {
					name,
					logoUrl,
				},
				plugins,
			};

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa en organization",
				exportData,
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
