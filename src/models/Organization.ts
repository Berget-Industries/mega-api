import { model, Schema, Types } from "npm:mongoose";

interface IPlugin {
	name: string;
	config: object;
}

export interface IOrganization {
	name: string;
	logoUrl: string;
	users: Types.ObjectId[];
	conversations: Types.ObjectId[];
	messages: Types.ObjectId[];
	plugins: IPlugin[];
}

export default model<IOrganization>(
	"Organization",
	new Schema({
		name: String,
		logoUrl: String,
		users: [{ type: Types.ObjectId, ref: "User" }],
		conversations: [{ type: Types.ObjectId, ref: "Conversation" }],
		messages: [{ type: Types.ObjectId, ref: "Message" }],
		plugins: Array,
	})
);
