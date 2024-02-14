import { model, Schema, Types } from "npm:mongoose";

export interface IUser {
	name: string;
	password: string;
	email: string;
	avatarUrl: string;
	organizations: Types.ObjectId[];
	systemAdmin: boolean;
}

export default model<IUser>(
	"User",
	new Schema<IUser>({
		name: String,
		password: { type: String, default: "" },
		email: { type: String, unique: true },
		avatarUrl: String,
		organizations: [{ type: Types.ObjectId, ref: "Organization" }],
		systemAdmin: { type: Boolean, default: false },
	})
);
