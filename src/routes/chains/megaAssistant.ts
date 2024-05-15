import mongoose from "npm:mongoose";
import { runMegaAssistant, IMegaAssistantStreamChunk } from "../../chains/mega-assistant/run.ts";
import saveChainMessage from "../../utils/saveChainMessage.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

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

		const ObjectId = mongoose.Types.ObjectId;
		const conversationId = ObjectId.isValid(conversationIdInput)
			? conversationIdInput
			: new ObjectId();

		const megaOutput = await runMegaAssistant({
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
			llmOutput: megaOutput,
			input: message,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output: megaOutput[1] ? megaOutput[1].output : megaOutput[0].output,
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

router.post("/mega-assistant/stream", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
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
			handleResponseError(ctx, {
				status: "missing-info",
				message: "contactEmail, contactName eller message saknas i body",
			});
			return;
		}

		const conversationId = new mongoose.Types.ObjectId(conversationIdInput).toString();

		// Skapa en ReadableStream för att hantera streaming av chunks
		let streamClosed = false;
		ctx.response.body = new ReadableStream({
			async start(controller) {
				const handleStreamChunk = (chunk: IMegaAssistantStreamChunk) => {
					controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk) + "\n"));
				};

				try {
					const megaOutput = await runMegaAssistant({
						onStreamChunk: handleStreamChunk,
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
						llmOutput: megaOutput,
						input: message,
					});
				} catch (error) {
					console.error("Critical error:", error);
				} finally {
					controller.close();
					streamClosed = true;
				}
			},
			cancel() {
				streamClosed = true;
				console.log("Client closed the connection");
			},
		});

		ctx.response.type = "application/json";
	} catch (error) {
		console.error("Critical error:", error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "error",
				message: "Invalid data format.",
			});
		} else {
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Technical error.",
			});
		}
	}
});

export default router;
