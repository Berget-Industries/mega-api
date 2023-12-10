import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Message, Contact, Organization } from "../models/index.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import aiAuthenticationMiddleware from "../middleware/aiAuthenticationMiddleware.ts";

import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

router.post(
	"/addMessageHistory",
	//authenticationMiddleware,
	aiAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { conversationId, contactEmail, contactName, createdAt, input, llmOutput } =
				await ctx.request.body().value;
			const organizationId = ctx.state.organization;

			let contact = await Contact.findOne({ email: contactEmail });
			if (!contact) {
				contact = await Contact.create({
					email: contactEmail,
					name: contactName,
				});
			}

			let conversation = await Conversation.findById(conversationId);
			if (!conversation) {
				conversation = await Conversation.create({
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

			conversation.organizationId = ctx.state.organization;
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

			const newConv = await Conversation.findById({ _id: conversationId })
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
