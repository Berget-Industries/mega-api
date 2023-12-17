import { Schema, Document, model, Types } from "npm:mongoose";
import { IUser } from "./User.ts";

// Definiera ett schema för sessionen
interface ISession extends Document {
	user: Types.ObjectId | IUser;
	token: string;
	expiry: number;
}

const SessionSchema: Schema = new Schema({
	user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	token: { type: String, required: true, unique: true },
	expiry: { type: Number, required: true },
});

export default model<ISession>("Session", SessionSchema);
