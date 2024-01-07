import { model, Schema, Types } from "npm:mongoose";

export interface IApiKey {
	key: string;
}

export default model<IApiKey>(
	"ApiKey",
	new Schema<IApiKey>({
		key: { type: String, required: true, unique: true },
	})
);
