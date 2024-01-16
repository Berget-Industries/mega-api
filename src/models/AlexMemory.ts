import { model, Schema, Types } from "npm:mongoose";

export interface IAlexMemory {
	messages: Types.Array<Object>;
}

export default model<IAlexMemory>(
	"AlexMemory",
	new Schema<IAlexMemory>({
		messages: { type: Types.Array, required: true, default: [] },
	})
);
