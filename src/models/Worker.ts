import { model, Schema, Types } from "npm:mongoose";

export interface IWorker {
	socketId: string;
	pluginName: string;
	plugins: Types.ObjectId[];
}

export default model<IWorker>(
	"Worker",
	new Schema<IWorker>({
		socketId: String,
		pluginName: String,
		plugins: [{ type: Schema.Types.ObjectId, ref: "Plugin" }],
	})
);
