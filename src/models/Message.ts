import { model, Schema } from "mongoose";

export interface IUsedTokens {
	input: number;
	output: number;
	total: number;
}

export interface ILLMOutput {
	name: string;
	output: string;
	usedTokens: IUsedTokens;
	responseTime: number;
	actions: string[];
}

export interface IMessage {
	_id: string;
	organizationId: { type: Schema.Types.ObjectId; ref: "Organization" };
	conversationId: { type: Schema.Types.ObjectId; ref: "Conversation" };
	contactId: { type: Schema.Types.ObjectId; ref: "Contact" };
	createdAt: Date;
	input: string;
	llmOutput: ILLMOutput[];
}

export const MessageSchema = new Schema<IMessage>({
	_id: String,
	organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
	conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
	contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
	createdAt: Date,
	input: String,
	llmOutput: Array,
});

export const Message = model<IMessage>("Message", MessageSchema);

export default Message;
