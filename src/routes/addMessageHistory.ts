import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import { Conversation, Message, Contact, Organization } from "../models/index.ts";

const router = new Router();
router.post(
	"/addMessageHistory",
	//authenticationMiddleware,
	async (ctx: Context) => {
		try {
			const {
				conversation,
				organization,
				contactEmail,
				contactName,
				createdAt,
				input,
				llmOutput,
			} = await ctx.request.body().value;

			let contact = await Contact.findOne({ email: contactEmail });
			if (!contact) {
				contact = await Contact.create({
					email: contactEmail,
					name: contactName,
				});
			}

			let conversationData = await Conversation.findById(conversation);
			if (!conversationData) {
				conversationData = await Conversation.create({
					_id: conversation,
					messages: [],
					lastActivity: createdAt,
				});
			}

			const messageDoc = await Message.create({
				conversationId: conversationData._id,
				organization,
				contactId: contact._id,
				createdAt,
				input,
				llmOutput,
			});

			conversationData.organization = organization;
			conversationData.contact = contact._id;
			conversationData.lastActivity = createdAt;
			conversationData.messages = [...conversationData.messages, messageDoc._id.toString()];
			await conversationData.save();

			await Organization.updateOne(
				{ _id: organization },
				{
					$addToSet: {
						conversations: conversationData._id,
						messages: messageDoc._id,
					},
				}
			);

			const newConv = await Conversation.findById({ _id: conversation })
				.populate("messages")
				.exec();
			if (!newConv) throw "asd";

			const body = { conversation: newConv.toJSON() };
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
	}
);

export default router;
