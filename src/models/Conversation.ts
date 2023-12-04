import { model, Schema } from "mongoose";

export interface IConveration {
	organizationId: { type: Schema.Types.ObjectId; ref: "Organization" };
	contactId: { type: Schema.Types.ObjectId; ref: "Contact" };
	messages: string[];
	lastActivity: Date;
}

export const ConversationSchema = new Schema({
	organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
	contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	lastActivity: Date,
});

export const ConversationModel = model<IConveration>("Conversation", ConversationSchema);

export default ConversationModel;
