import mongoose from "npm:mongoose";
import runMailSubjector from "../../chains/mailSubjector/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Message } from "../../models/index.ts";

const router = new Router();
router.post("/mailSubjector", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { messageId } = await ctx.request.body().value;

		if (!messageId) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "messageId keys saknas i body",
			});
		}

		const messageDoc = await Message.findById(messageId);
		if (!messageDoc) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "Message hittades inte.",
			});
			return;
		}

		const userMessage = messageDoc.input;
		const assistantMessage = messageDoc.llmOutput[0].output;
		const mailSubjector = await runMailSubjector({ userMessage, assistantMessage });

		const newMessageDoc = await Message.findByIdAndUpdate(
			messageId,
			{
				$addToSet: { llmOutput: mailSubjector },
			},
			{ new: true }
		);

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output: mailSubjector.output,
			messageId: newMessageDoc?._id.toString(),
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
