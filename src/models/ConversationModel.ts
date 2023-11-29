import { model, Schema } from "mongoose";

export type IChatAttachment = {
	name: string;
	size: number;
	type: string;
	path: string;
	preview: string;
	createdAt: Date;
	modifiedAt: Date;
};

export type IChatMessage = {
	id: string;
	body: string;
	createdAt: Date;
	senderId: string;
	contentType: string;
	attachments: IChatAttachment[];
};

export type IChatParticipant = {
	id: string;
	name: string;
	role: string;
	email: string;
	address: string;
	avatarUrl: string;
	phoneNumber: string;
	lastActivity: Date;
	status: "online" | "offline" | "alway" | "busy";
};

export type IChatConversation = {
	type: string;
	unreadCount: number;
	messages: IChatMessage[];
	participants: IChatParticipant[];
};

export type IChatConversations = {
	byId: Record<string, IChatConversation>;
	allIds: string[];
};

export const ConversationSchema = new Schema<IChatConversation>({
	type: { type: String, default: "ONE_TO_ONE" },
	participants: { type: Array, default: [] },
	unreadCount: { type: Number, default: 0 },
	messages: { type: Array, default: [] },
});

export const Conversation = model<IChatConversation>("Conversation", ConversationSchema);

export default ConversationSchema;
