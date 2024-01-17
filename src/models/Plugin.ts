import { model, Schema, Types } from "npm:mongoose";

export interface IPlugin {
	name: string;
	type: "chain" | "tool" | "input";
	isActivated: boolean;
	config: object;
	organization: Types.ObjectId;
}

export default model<IPlugin>(
	"Plugin",
	new Schema({
		name: String,
		type: String,
		isActivated: Boolean,
		config: Object,
		organization: [{ type: Types.ObjectId, ref: "Organization" }],
	})
);
