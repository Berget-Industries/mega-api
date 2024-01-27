import { model, Schema, Types } from "npm:mongoose";

export interface IWorker {
	socketId: string;
	plugins: Types.ObjectId[];
}

export default model<IWorker>(
	"Worker",
	new Schema<IWorker>({
		socketId: String,
		plugins: [{ type: Schema.Types.ObjectId, ref: "Plugin" }],
	})
);
