import { model, Schema } from "mongoose";

export interface IUser {
	name: string;
	password: string;
	email: string;
	avatarUrl: string;
	organizations: string[];
}

export default model<IUser>(
	"User",
	new Schema<IUser>({
		name: String,
		password: String,
		email: String,
		avatarUrl: String,
		organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
	})
);
