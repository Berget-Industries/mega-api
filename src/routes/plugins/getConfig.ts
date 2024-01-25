import mongoose from "npm:mongoose";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
	handleResponseError,
	handleResponsePartialContent,
	handleResponseSuccess,
	handleResponseUnauthorized,
} from "../../utils/contextHandler.ts";

const router = new Router();
router.get("/get-config", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;
		const pluginName = params.get("plugin");

		if (!pluginName) {
			handleResponsePartialContent(ctx, {
				status: "missing-information",
				message: "Key pluginName saknas.",
			});
			return;
		}

		const organizationId = ctx.state.organizationId;
		const config = await getPluginConfig(pluginName, organizationId);

		if (!config) {
			handleResponseUnauthorized(ctx, {
				status: "Unauthorized",
				message: "Plugin är inte aktiverat på organisationen.",
			});
			return;
		}

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hämta plugin config!",
			config,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
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
