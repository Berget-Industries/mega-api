import mongoose from "npm:mongoose";
import { Conversation, Message, Contact, Organization } from "../models/index.ts";

interface IUsedTokens {
	input: number;
	output: number;
	total: number;
}

interface IAction {
	type: "skapa-reservation" | "redigera-reservation" | "avboka-reservation";
	docId: string;
	input: string;
	date: Date;
}

interface ILLMOutput {
	name: string;
	output: string;
	usedTokens: IUsedTokens;
	responseTime: number;
	actions: IAction[];
}

interface ISaveMessageInput {
	organization: mongoose.Types.ObjectId;
	conversation: mongoose.Types.ObjectId;
	contactEmail: string;
	contactName: string;
	createdAt: Date;
	input: string;
	llmOutput: ILLMOutput[];
}

export default async function saveMessage({
	organization,
	conversation,
	contactEmail,
	contactName,
	createdAt,
	input,
	llmOutput,
}: ISaveMessageInput): Promise<void> {
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

	return Promise.resolve();
}
