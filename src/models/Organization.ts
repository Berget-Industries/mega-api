import { model, Schema } from "npm:mongoose";

export interface IOrganization {
	id: string;
	name: string;
	logoUrl: string;
	users: string[];
	conversations: string[];
	messages: string[];
}

export default model<IOrganization>(
	"Organization",
	new Schema({
		name: String,
		logoUrl: String,
		users: [{ type: Schema.Types.ObjectId, ref: "User" }],
		conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
		messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	})
);
