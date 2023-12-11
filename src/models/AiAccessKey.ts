import { model, Schema } from "npm:mongoose";

export interface IAiAccessKey {
	key: string;
	organization: { type: Schema.Types.ObjectId };
}

export default model<IAiAccessKey>(
	"AiAccessKey",
	new Schema<IAiAccessKey>({
		key: { type: String, required: true, unique: true },
		organization: { type: Schema.Types.ObjectId, ref: "Organization" },
	})
);
