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
		const conversationId = ctx.request.url.searchParams.get("conversationId");
		if (!conversationId) {
			const body = getMissingIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}
		const conversation = await Conversation.findById(conversationId)
			.populate("messages contactId")
			.exec();

		const body = { conversation };
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		handleResponseError(ctx, body);
	}
});

export default router;
