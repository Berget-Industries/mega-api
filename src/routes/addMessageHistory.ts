import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ConversationModel } from "../models/Conversation.ts";
import { Message } from "../models/Message.ts";
import ContactModel from "../models/Contact.ts";
import Organization from "../models/Organization.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";

const router = new Router();

router.post(
	"/addMessageHistory",
	//authenticationMiddleware,
	async (ctx: Context) => {
		try {
			const {
				conversationId,
				organizationId,
				contactEmail,
				contactName,
				createdAt,
				input,
				llmOutput,
			} = await ctx.request.body().value;

			let contact = await ContactModel.findOne({ email: contactEmail });
			if (!contact) {
				contact = await ContactModel.create({
					email: contactEmail,
					name: contactName,
				});
			}

			let conversation = await ConversationModel.findById(conversationId);
			if (!conversation) {
				conversation = await ConversationModel.create({
					_id: conversationId,
					messages: [],
					lastActivity: createdAt,
				});
			}

			const messageDoc = await Message.create({
				conversationId: conversation._id,
				organizationId,
				contactId: contact._id,
				createdAt,
				input,
				llmOutput,
			});

			conversation.organizationId = organizationId;
			conversation.contactId = contact._id;
			conversation.lastActivity = createdAt;
			conversation.messages = [...conversation.messages, messageDoc._id.toString()];
			await conversation.save();

			await Organization.updateOne(
				{ _id: organizationId },
				{
					$addToSet: {
						conversations: conversation._id,
						messages: messageDoc._id,
					},
				}
			);

			const newConv = await ConversationModel.findById({ _id: conversationId })
				.populate("messages")
				.exec();

			if (!newConv) throw "asd";

			ctx.response.status = 200;
			ctx.response.body = { conversation: newConv.toJSON() };
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
);

export default router;
