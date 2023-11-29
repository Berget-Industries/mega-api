import { model, Schema } from "mongoose";

export interface IUser {
	name: string;
	password: string;
	email: string;
	avatarUrl: string;
	organizations: string[];
}

export const UserSchema = new Schema<IUser>({
	name: String,
	password: String,
	email: String,
	avatarUrl: String,
	organizations: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
});

export const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
