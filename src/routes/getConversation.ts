import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Organization, Reservation } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";

const router = new Router();

router.get("/organization/conversation", async (ctx: Context) => {
	try {
		const conversationId = ctx.request.url.searchParams.get("conversationId");

		if (!conversationId) {
			const body = getMissingIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const conversation = await Conversation.findById(conversationId)
			.populate("messages contactId")
			.exec();

		ctx.response.status = 200;
		ctx.response.body = { conversation };
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 400;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
});

export default router;
