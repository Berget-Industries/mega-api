import { model, Schema } from "mongoose";

export interface IConveration {
	organizationId: { type: Schema.Types.ObjectId; ref: "Organization" };
	contactId: { type: Schema.Types.ObjectId; ref: "Contact" };
	messages: string[];
	lastActivity: Date;
}

export default model<IConveration>(
	"Conversation",
	new Schema({
		organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
		contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
		messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
		lastActivity: Date,
	})
);
