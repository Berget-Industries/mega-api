import { model, Schema } from "mongoose";

export interface IUser {
	name: string;
	password: string;
	email: string;
	avatarUrl: string;
	organizations: string[];
	systemAdmin: boolean;
}

export default model<IUser>(
	"User",
	new Schema<IUser>({
		name: String,
		password: String,
		email: { type: String, unique: true },
		avatarUrl: String,
		organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
		systemAdmin: { type: Boolean, default: false },
	})
);
