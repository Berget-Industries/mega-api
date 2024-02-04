import { model, Schema, Types, Document } from "npm:mongoose";
export interface IConversation extends Document {
	_id: Types.ObjectId;
	organization: Types.ObjectId;
	contact: Types.ObjectId;
	messages: Types.ObjectId[];
	lastActivity: Date;
}

export default model<IConversation>(
	"Conversation",
	new Schema({
		organization: { type: Types.ObjectId, ref: "Organization" },
		contact: { type: Types.ObjectId, ref: "Contact" },
		messages: [{ type: Types.ObjectId, ref: "Message" }],
		lastActivity: Date,
	})
);
