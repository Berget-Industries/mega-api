import { model, Schema } from "npm:mongoose";

export interface IContact {
	name: string;
	email: string;
	phoneNumber: string;
	avatarUrl: string;
}

export default model<IContact>(
	"Contact",
	new Schema({
		name: String,
		email: String,
		phoneNumber: String,
		avatarUrl: String,
	})
);
