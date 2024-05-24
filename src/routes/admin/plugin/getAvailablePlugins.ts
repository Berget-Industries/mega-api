import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getAvailablePlugins } from "../../../utils/getAvailablePlugins.ts";
import { Organization, Plugin } from "../../../models/index.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.get(
	"/get-available-plugins",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const organizationId = ctx.request.url.searchParams.get("organizationId");

			if (!organizationId) {
				handleResponsePartialContent(ctx, {
					status: "missing-id",
					message: "Saknar följande params organisationId",
				});
				return;
			}

			const organization = await Organization.findById(organizationId);

			if (!organization) {
				handleResponsePartialContent(ctx, {
					status: "not-found",
					message: "Kunde inte hitta organisationen.",
				});
			}

			const orgPlugins = await Plugin.find({ organization: organizationId });

			const allAvailablePlugins = getAvailablePlugins();

			const actualAvailablePlugins = allAvailablePlugins.filter((availablePlugin) => {
				if (availablePlugin.allowMultiple) {
					return true;
				} else {
					const doesPluginExist = orgPlugins.some(
						(orgPlugin) => orgPlugin.name === availablePlugin.name
					);
					return !doesPluginExist;
				}
			});

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa ett nytt plugin.",
				availablePlugins: actualAvailablePlugins,
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
