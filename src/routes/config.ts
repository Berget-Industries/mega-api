import mongoose from "npm:mongoose";
import { Organization } from "../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import aiAuthenticationMiddleware from "../middleware/apiKeyAuthenticationMiddleware.ts";

const router = new Router();

router.post("/getConfig", aiAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const plugin = ctx.request.url.searchParams.get("plugin");
		const organization = ctx.request.url.searchParams.get("organization");

		if (!organization) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Organisationens id saknas.",
			});
			return;
		}

		if (!plugin) {
			handleResponseError(ctx, {
				status: "plugin-not-found",
				message: "Pluginet kunde inte hittas.",
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

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Organisationens config har hämtats.",
			plugin: organizationDoc.plugin,
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
