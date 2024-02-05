import { Organization, Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.get(
	"/list",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const organizationDocs = await Organization.find({});

			const organizations = [];

			for (const org of organizationDocs) {
				const pluginDocs = await Plugin.find({ organization: org._id })
					.select(["_id", "name", "type", "isActivated"])
					.exec();

				const organization = org.toObject();
				const plugins = pluginDocs.map((plugin) => plugin.toObject());
				organizations.push({ ...organization, plugins });
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades hämta alla organizationer!",
				organizations,
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
