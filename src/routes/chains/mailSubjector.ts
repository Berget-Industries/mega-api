import mongoose from "npm:mongoose";
import runMailSubjector from "../../chains/mailSubjector/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/mailSubjector", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { userMessage, assistantMessage } = await ctx.request.body().value;

		if (!userMessage || !assistantMessage) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "userMessage eller assistatMessage keys saknas i body",
			});
		}

		const { output, usedTokens } = await runMailSubjector({ userMessage, assistantMessage });

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
