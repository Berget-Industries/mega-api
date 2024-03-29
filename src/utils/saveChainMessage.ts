import { Conversation, Message, Contact } from "../models/index.ts";
import { ILLMOutput } from "../models/Message.ts";
import { Types } from "npm:mongoose";
import { IConversation } from "../models/Conversation.ts";

interface ISaveChainMessageInput {
	organizationId: string;
	conversationId: string;
	contactEmail: string;
	contactName: string;
	messageId: string;
	createdAt: Date;
	llmOutput: ILLMOutput[];
	input: string;
}

export default async function saveChainMessage({
	organizationId,
	conversationId,
	contactEmail,
	contactName,
	messageId,
	createdAt,
	llmOutput,
	input,
}: ISaveChainMessageInput) {
	try {
		let contactDoc = await Contact.findOne({ email: contactEmail });
		if (!contactDoc) {
			contactDoc = await Contact.create({
				email: contactEmail,
				name: contactName,
			});
		} else {
			contactDoc.name = contactName;
			await contactDoc.save();
		}

		const actualConversationId = conversationId || new Types.ObjectId();
		let conversationDoc = await Conversation.findById(actualConversationId);
		if (!conversationDoc) {
			conversationDoc = await Conversation.create({
				organization: new Types.ObjectId(organizationId),
				lastActivity: createdAt,
				messages: [],
				contact: contactDoc._id,
				_id: actualConversationId,
			});
		}

		const actualMessageId = messageId || new Types.ObjectId();
		let messageDoc = await Message.findById(actualMessageId);
		if (!messageDoc) {
			messageDoc = await Message.create({
				organization: new Types.ObjectId(organizationId),
				conversation: conversationDoc._id,
				contact: contactDoc._id,
				createdAt,
				llmOutput,
				input,
			});
		} else {
			messageDoc.llmOutput = [...messageDoc.llmOutput, ...llmOutput];
			await messageDoc.save();
		}

		await Conversation.findByIdAndUpdate(conversationDoc._id, {
			lastActivity: createdAt,
			$addToSet: { messages: messageDoc._id },
		});

		return Promise.resolve({
			conversationId: conversationDoc._id,
			messageId: messageDoc._id,
		});
	} catch (error) {
		console.error(error);
	}
}
