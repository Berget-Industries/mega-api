import { model, Schema } from "mongoose";

export interface IContact {
	name: string;
	email: string;
	phoneNumber: string;
	avatarUrl: string;
}

export const ContactSchema = new Schema({
	name: String,
	email: String,
	phoneNumber: String,
	avatarUrl: String,
});

export const ContactModel = model<IContact>("Contact", ContactSchema);

export default ContactModel;
