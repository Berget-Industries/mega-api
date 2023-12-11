import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Organization, Reservation } from "../models/index.ts";
import mongoose from "mongoose";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

router.get("/organization/conversation", async (ctx: Context) => {
	try {
		const conversationId = ctx.request.url.searchParams.get("conversationId");
		if (!conversationId) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}
		const conversation = await Conversation.findById(conversationId)
			.populate("messages contactId")
			.exec();
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hitta konversation",
			conversation,
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
