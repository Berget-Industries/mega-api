import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ConversationModel } from "../models/Conversation.ts";
import { Message } from "../models/Message.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";
const router = new Router();

async function addMessageHistory(ctx: Context) {
	try {
		const {
			_id,
			organizationId,
			conversationId,
			contactId,
			createdAt,
			lastActivity,
			input,
			llmOutput,
		} = await ctx.request.body().value;

		let conversation = await ConversationModel.findById(_id);
		if (!conversation) {
			conversation = await ConversationModel.create({
				_id,
				organizationId,
				conversationId,
				messages: [],
				contactId,
				createdAt,
				lastActivity,
			});
		}

		const messageDoc = await Message.create({
			conversationId,
			organizationId,
			contactId,
			createdAt,
			input,
			llmOutput,
		});

		conversation.messages = [...conversation.messages, messageDoc._id];
		await conversation.save();

		ctx.response.status = 200;
		ctx.response.body = { conversation: conversation.toJSON(), ticket: messageDoc.toJSON() };
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
