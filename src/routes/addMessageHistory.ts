import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation } from "../models/ConversationModel.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import Ticket from "../models/TicketModel.ts";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";
const router = new Router();

async function addMessageHistory(ctx: Context) {
	try {
		const {
			_id,
			messages,
			participants,
			date,
			contact,
			responseTime,
			timeSaved,
			usedTokens,
			type,
		} = await ctx.request.body().value;

		let conversation = await Conversation.findById(_id);
		if (!conversation) {
			conversation = await Conversation.create({ _id, participants });
		}

		conversation.messages = [...conversation.messages, ...messages];
		await conversation.save();

		let ticket = await Ticket.findOneAndUpdate(
			{ conversationId: _id },
			{
				$set: {
					responseTime,
					usedTokens,
					timeSaved,
					contact,
					date,
					type,
				},
			},
			{ new: true }
		);

		if (!ticket) {
			ticket = await Ticket.create({
				conversationId: _id,
				responseTime,
				usedTokens,
				timeSaved,
				contact,
				date,
				type,
			});
		}

		ctx.response.status = 200;
		ctx.response.body = { conversation: conversation.toJSON(), ticket: ticket.toJSON() };
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			console.error(error);
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
}

router.post(
	"/addMessageHistory",
	//authenticationMiddleware,
	addMessageHistory
);

export default router;
