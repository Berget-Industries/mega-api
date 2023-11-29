import { model, Schema } from "mongoose";

export interface IOrganization {
	id: string;
	name: string;
	logoUrl: string;
	users: string[];
	conversations: string[];
}

export const OrganizationSchema = new Schema({
	name: String,
	logoUrl: String,
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
});

export default model<IOrganization>("Organization", OrganizationSchema);
