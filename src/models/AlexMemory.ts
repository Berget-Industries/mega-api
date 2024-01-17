import { model, Schema, Types } from "npm:mongoose";

export interface IAlexMemory {
	messages: object[];
}

export default model<IAlexMemory>(
	"AlexMemory",
	new Schema<IAlexMemory>({
		messages: { type: Array, required: true, default: [] },
	})
);
