import mongoose from "npm:mongoose";
import runMegaAssistant from "../../chains/mega-assistant/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/mega-assistant", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { conversationId, contactEmail, contactName, input } = await ctx.request.body().value;
		const organizationId = ctx.state.organizationId;

		if (!conversationId || !contactEmail || !contactName || !input) {
			handleResponseError(ctx, {
				status: "missing-info",
				message:
					"conversationId eller contactEmail eller contactName eller input keys saknas i body",
			});
		}

		const output = await runMegaAssistant({
			organizationId,
			conversationId,
			contactEmail,
			contactName,
			input,
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
