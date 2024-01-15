import mongoose from "npm:mongoose";
import runManualFilterChain from "../../chains/manualFilter/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/manualFilter", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { message, organizationSystemPrompt } = await ctx.request.body().value;

		if (!message || !organizationSystemPrompt) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "message eller organizationSystemPrompt keys saknas i body",
			});
		}

		const { output, usedTokens } = await runManualFilterChain({
			message,
			organizationSystemPrompt,
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
