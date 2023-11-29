import { model, Schema } from "mongoose";

export interface User {
	displayName: string;
	email: string;
	password: string;
	photoURL: string;
	phoneNumber: string;
	country: string;
	address: string;
	state: string;
	city: string;
	zipCode: string;
	about: string;
	role: string;
	isPublic: true;
}

export const UserSchema = new Schema<User>({
	displayName: { type: String, default: "", required: true },
	email: { type: String, default: "", required: true },
	password: { type: String, default: "", required: true },
	photoURL: { type: String, default: "" },
	phoneNumber: { type: String, default: "" },
	country: { type: String, default: "" },
	address: { type: String, default: "" },
	state: { type: String, default: "" },
	city: { type: String, default: "" },
	zipCode: { type: String, default: "" },
	about: { type: String, default: "" },
	role: { type: String, default: "" },
	isPublic: { type: Boolean, default: true },
});

export const User = model<User>("User", UserSchema);

export default User;
