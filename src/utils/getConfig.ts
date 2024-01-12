import mongoose from "npm:mongoose";
import { Organization } from "../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "./contextHandler.ts";
import aiAuthenticationMiddleware from "../middleware/apiKeyAuthenticationMiddleware.ts";

const router = new Router();

router.post("/getConfig", aiAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const pluginName = ctx.request.url.searchParams.get("plugin");
		const organization = ctx.request.url.searchParams.get("organization");

		if (!organization) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Organisationens id saknas.",
			});
			return;
		}

		if (!pluginName) {
			handleResponseError(ctx, {
				status: "plugin-missing",
				message: "Pluginet saknas.",
			});
		}

		const organizationDoc = await Organization.findById(organization);
		if (!organizationDoc) {
			handleResponseError(ctx, {
				status: "org-not-found",
				message: "Kunde inte hitta organisation.",
			});
			return;
		}

		const plugin = organizationDoc.plugins.find((_) => _.name === pluginName);
		if (!plugin) {
			handleResponseError(ctx, {
				status: "plugin-not-found",
				message: "Pluginet kunde inte hittas.",
			});
			return;
		}

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Organisationens plugin har hämtats.",
			plugin: plugin,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "error",
				message: "Nånting gick fel.",
			});
			return;
		}
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
});

export default router;
