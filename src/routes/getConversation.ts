import mongoose from "mongoose";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import { Conversation, Organization, Reservation } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";

const router = new Router();
router.get("/organization/conversation", async (ctx: Context) => {
	try {
		const conversation = ctx.request.url.searchParams.get("conversation");
		if (!conversation) {
			const body = getMissingIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}
		const conversationDoc = await Conversation.findById(conversation)
			.populate("messages contact")
			.exec();

		const body = { conversationDoc };
		handleResponseSuccess(ctx, body);
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
