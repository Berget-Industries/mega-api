import { model, Schema, Types } from "npm:mongoose";

export interface IConveration {
	organization: Types.ObjectId;
	contact: Types.ObjectId;
	messages: Types.ObjectId[];
	lastActivity: Date;
}

export default model<IConveration>(
	"Conversation",
	new Schema({
		organization: { type: Types.ObjectId, ref: "Organization" },
		contact: { type: Types.ObjectId, ref: "Contact" },
		messages: [{ type: Types.ObjectId, ref: "Message" }],
		lastActivity: Date,
	})
);
