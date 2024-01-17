import mongoose from "npm:mongoose";
import runManualFilterChain from "../../chains/manualFilter/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import getPluginConfig from "../../utils/getPluginConfig.ts";

const router = new Router();
router.post("/manualFilter", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { message, organizationId } = await ctx.request.body().value;

		if (!message || !organizationId) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "message eller organizationId keys saknas i body",
			});
		}

		const manualFilterConfig = await getPluginConfig("manualFilter", organizationId);

		const { output, usedTokens } = await runManualFilterChain({
			message,
			organizationSystemPrompt: manualFilterConfig.systemPrompt,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output,
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
