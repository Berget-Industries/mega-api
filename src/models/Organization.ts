import { model, Schema, Types } from "npm:mongoose";

interface IPlugin {
	name: string;
	config: object;
	activated: boolean;
	type: string;
}

export interface IOrganization {
	name: string;
	logoUrl: string;
	users: Types.ObjectId[];
	plugins: IPlugin[];
}

export default model<IOrganization>(
	"Organization",
	new Schema({
		name: String,
		logoUrl: String,
		users: [{ type: Types.ObjectId, ref: "User" }],
		plugins: Array,
	})
);
