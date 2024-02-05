import mongoose from "npm:mongoose";
import runMegaAssistant from "../../chains/mega-assistant/run.ts";
import saveChainMessage from "../../utils/saveChainMessage.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Types } from "npm:mongoose";

const router = new Router();
router.post("/mega-assistant", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const {
			messageId,
			conversationId: conversationIdInput,
			contactEmail,
			contactName,
			message,
		} = await ctx.request.body().value;
		const organizationId = ctx.state.organizationId;

		if (!contactEmail || !contactName || !message) {
			// Det är okej att messageId är tom. Det betyder att det är första meddelandet i konversationen.
			handleResponseError(ctx, {
				status: "missing-info",
				message: "contactEmail eller contactName eller input keys saknas i body",
			});
		}

		const conversationId = new Types.ObjectId(conversationIdInput).toString();

		const [alex, eva] = await runMegaAssistant({
			organizationId,
			conversationId,
			contactEmail,
			contactName,
			message,
		});

		const savedMessage = await saveChainMessage({
			organizationId,
			conversationId,
			contactEmail,
			contactName,
			messageId,
			createdAt: new Date(),
			llmOutput: [alex, eva],
			input: message,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output: eva.output,
			...savedMessage,
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
