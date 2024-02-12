import { Plugin, Organization } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { globalEventTarget } from "../../../utils/globalEventTarget.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { getAvailablePlugins, findPlugin } from "../../../utils/getAvailablePlugins.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/add",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organizationId, name, config } = await ctx.request.body().value;

			if (!name || !config || !organizationId) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId, name, config. Kan inte aktivera plugin.",
				});
				return;
			}

			const foundDefaultPlugin = findPlugin(name);
			if (!foundDefaultPlugin) {
				handleResponsePartialContent(ctx, {
					status: "plugin-not-found",
					message: "Pluginet existerar inte.",
				});
				return;
			}

			const { dependencies, type } = foundDefaultPlugin;

			const organizationDoc = await Organization.findById(organizationId);
			if (!organizationDoc) {
				handleResponsePartialContent(ctx, {
					status: "organization-not-found",
					message: "Organizationen existerar inte.",
				});
				return;
			}

			if (type !== "input") {
				const foundPlugin = await Plugin.findOne({ name, organization: organizationId });
				if (foundPlugin) {
					handleResponsePartialContent(ctx, {
						status: "already-exciting",
						message: "Det går endast att ha en instans av detta plugin.",
					});
					return;
				}
			}

			const newPlugin = await Plugin.create({
				organization: organizationId,
				dependencies,
				config,
				name,
				type,
			});

			await Organization.findByIdAndUpdate(organizationId, {
				$addToSet: { plugins: newPlugin._id },
			});

			if (name === "mailer") {
				globalEventTarget.dispatchEvent(new Event("update-plugins-mailer"));
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa ett nytt plugin.",
				plugin: newPlugin.toObject(),
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
