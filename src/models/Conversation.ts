import { model, Schema } from "mongoose";

export interface IConveration {
	_id: string;
	organizationId: string;
	contactId: string;
	messages: string[];
	lastActivity: Date;
}

export const ConversationSchema = new Schema({
	_id: String,
	organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
	contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	lastActivity: Date,
});

export const ConversationModel = model<IConveration>("Conversation", ConversationSchema);

export default ConversationModel;
