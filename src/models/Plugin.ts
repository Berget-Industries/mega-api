import { model, Schema, Types } from "npm:mongoose";

export interface IPlugin {
	name: string;
	type: "chain" | "tool" | "input";
	isActivated: boolean;
	config: object;
	organization: Types.ObjectId;
	dependencies: string[];
}

export default model<IPlugin>(
	"Plugin",
	new Schema({
		name: String,
		type: String,
		isActivated: { type: Boolean, default: false },
		config: Object,
		organization: { type: Types.ObjectId, ref: "Organization" },
		dependencies: Array,
	})
);
