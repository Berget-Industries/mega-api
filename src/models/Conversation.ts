import { model, Schema } from "mongoose";

export interface IConveration {
	organization: { type: Schema.Types.ObjectId; ref: "Organization" };
	contact: { type: Schema.Types.ObjectId; ref: "Contact" };
	messages: string[];
	lastActivity: Date;
}

export default model<IConveration>(
	"Conversation",
	new Schema({
		organization: { type: Schema.Types.ObjectId, ref: "Organization" },
		contact: { type: Schema.Types.ObjectId, ref: "Contact" },
		messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
		lastActivity: Date,
	})
);
