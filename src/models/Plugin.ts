import { model, Schema, Types } from "npm:mongoose";

export interface IPlugin {
	name: string;
	type: "chain" | "tool" | "input";
	isActivated?: boolean;
	config: object;
	organization: Types.ObjectId;
	dependencies: string[];
	worker: Types.ObjectId | null;
	lastHeartbeat: Date | null;
}

export default model<IPlugin>(
	"Plugin",
	new Schema({
		name: String,
		type: String,
		isActivated: { type: Boolean, default: false, required: false },
		config: Object,
		organization: { type: Types.ObjectId, ref: "Organization" },
		dependencies: Array,
		worker: { type: Types.ObjectId, ref: "Worker", default: null },
		lastHeartbeat: { type: Date, default: null },
	})
);
