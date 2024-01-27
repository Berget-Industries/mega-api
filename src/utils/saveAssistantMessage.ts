import { Conversation, Message, Contact, Organization } from "../models/index.ts";
import { ILLMOutput } from "../models/Message.ts";
import { Types } from "npm:mongoose";

interface ISaveAssistantMessageInput {
	organizationId: string;
	conversationId: string;
	contactEmail: string;
	contactName: string;
	createdAt: Date;
	llmOutput: ILLMOutput[];
	input: string;
}

export default async function saveAssistantMessage({
	organizationId,
	conversationId,
	contactEmail,
	contactName,
	createdAt,
	llmOutput,
	input,
}: ISaveAssistantMessageInput) {
	try {
		let contactDoc = await Contact.findOne({ email: contactEmail });
		if (!contactDoc) {
			contactDoc = await Contact.create({
				email: contactEmail,
				name: contactName,
			});
		}

		let conversationDoc = await Conversation.findById(conversationId);
		if (!conversationDoc) {
			conversationDoc = await Conversation.create({
				lastActivity: createdAt,
				_id: conversationId,
				messages: [],
			});
		}

		const messageDoc = await Message.create({
			organization: new Types.ObjectId(organizationId),
			conversation: conversationDoc._id,
			contact: contactDoc._id,
			createdAt,
			llmOutput,
			input,
		});

		conversationDoc.contact = contactDoc._id;
		conversationDoc.lastActivity = createdAt;
		conversationDoc.organization = new Types.ObjectId(organizationId);
		conversationDoc.messages = [...conversationDoc.messages, messageDoc._id];
		await conversationDoc.save();
	} catch (error) {
		console.error(error);
	}
}
