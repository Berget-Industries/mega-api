import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation, Conversation } from "../../models/index.ts";
import mongoose from "mongoose";
import {
	getEditReservationErrorMessage,
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationNoChangeMessage,
} from "../../utils/errorMessages.ts";

import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();

router.post("/reservation/edit", async (ctx: Context) => {
	try {
		const { _id, name, email, date, time, numberOfGuests, phone, conversationId } =
			await ctx.request.body().value;
		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
		};

		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		if (Object.keys(updateData).length === 0) {
			const body = getEditReservationNoChangeMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData, $addToSet: { conversations: conversationId } },
			{ new: true }
		);

		// let conversation = await ConversationModel.findById(conversationId);
		// if (!conversation) {
		// 	conversation = await ConversationModel.create({
		// 		_id: conversationId,
		// 		organizationId: "",
		// 		contactId: "",
		// 		messages: [],
		// 		lastActivity: new Date(),
		// 		actions: [],
		// 	});
		// }

		// conversation.actions = [
		// 	...conversation.actions,
		// 	{
		// 		type: "editReservation",
		// 		docId: conversationId,
		// 		date: new Date(),
		// 	},
		// ];

		const body = getEditReservationSuccessMessage(reservationDetails);
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		handleResponseError(ctx, body);
	}
});

export default router;
