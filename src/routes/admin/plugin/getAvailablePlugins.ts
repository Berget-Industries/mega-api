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

			console.log(organization);

			const allAvailablePlugins = getAvailablePlugins();

			const actualAvailablePlugins = allAvailablePlugins.filter((availablePlugin) => {
				if (availablePlugin.type !== "input") {
					const doesPluginExist = orgPlugins.some(
						(orgPlugin) => orgPlugin.name === availablePlugin.name
					);
					console.log(allAvailablePlugins);
					console.log(orgPlugins);
					console.log(doesPluginExist);
					return !doesPluginExist;
				} else {
					return true;
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
