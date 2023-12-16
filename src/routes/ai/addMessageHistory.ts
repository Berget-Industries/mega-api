import mongoose from "npm:mongoose";
import aiAuthenticationMiddleware from "../../middleware/aiAuthenticationMiddleware.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Conversation, Message, Contact, Organization } from "../../models/index.ts";

const router = new Router();
router.post("/addMessageHistory", aiAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { conversation, contactEmail, contactName, createdAt, input, llmOutput } =
			await ctx.request.body().value;
		const organization = ctx.state.organization;

		let contactDoc = await Contact.findOne({ email: contactEmail });
		if (!contactDoc) {
			contactDoc = await Contact.create({
				email: contactEmail,
				name: contactName,
			});
		}

		let conversationDoc = await Conversation.findById(conversation);
		if (!conversationDoc) {
			conversationDoc = await Conversation.create({
				_id: conversation,
				messages: [],
				lastActivity: createdAt,
			});
		}

		const messageDoc = await Message.create({
			conversation: conversationDoc._id,
			organization,
			contact: contactDoc._id,
			createdAt,
			input,
			llmOutput,
		});

		conversationDoc.organization = organization;
		conversationDoc.contact = contactDoc._id;
		conversationDoc.lastActivity = createdAt;
		conversationDoc.messages = [...conversationDoc.messages, messageDoc._id];
		await conversationDoc.save();

		await Organization.updateOne(
			{ _id: organization },
			{
				$addToSet: {
					conversations: conversationDoc._id,
					messages: messageDoc._id,
				},
			}
		);

		const newConv = await Conversation.findById({ _id: conversation })
			.populate("messages")
			.exec();
		if (!newConv) throw "asd";
		handleResponseSuccess(ctx, {
			status: "invalid-id",
			message: "Kunde inte hitta konversationen. ID:et är ogiltigt.",
			conversation: newConv.toJSON(),
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "error",
				message: "Nånting gick fel.",
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
