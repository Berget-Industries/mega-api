import { model, Schema, Types } from "npm:mongoose";

export interface IAiAccessKey {
	key: string;
	organization: Types.ObjectId;
}

export default model<IAiAccessKey>(
	"AiAccessKey",
	new Schema<IAiAccessKey>({
		key: { type: String, required: true, unique: true },
		organization: { type: Types.ObjectId, ref: "Organization" },
	})
);
