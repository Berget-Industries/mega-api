import { model, Schema, Types } from "npm:mongoose";

export interface IApiKey {
	key: string;
	organization: Types.ObjectId;
	systemKey: boolean;
}

export default model<IApiKey>(
	"ApiKey",
	new Schema<IApiKey>({
		key: { type: String, required: true, unique: true },
		organization: { type: Types.ObjectId, required: true, ref: "Organization" },
		systemKey: { type: Boolean, default: false },
	})
);
