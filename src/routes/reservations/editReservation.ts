import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation, Conversation } from "../../models/index.ts";
import mongoose from "mongoose";
import {
	getEditReservationErrorMessage,
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationNoChangeMessage,
} from "../../utils/errorMessages.ts";

const router = new Router();

router.post("/reservation/edit", async (ctx: Context) => {
	try {
		const { _id, name, email, date, time, numberOfGuests, phone, conversationId } =
			await ctx.request.body().value;

		const combinedDate = new Date(`${date}T${time}`);
		const dateInUTC = new Date(
			combinedDate.getTime() - combinedDate.getTimezoneOffset() * 60000
		);

		const input = {
			name,
			email,
			date: dateInUTC,
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
			ctx.response.status = 200;
			ctx.response.body = body;
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
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
});

export default router;
