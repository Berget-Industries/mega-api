import { model, Schema } from "mongoose";

export interface IContact {
	_id: string;
	name: string;
	email: string;
	phoneNumber: string;
	avatarUrl: string;
}

export const ContactSchema = new Schema({
	_id: String,
	name: String,
	email: String,
	phoneNumber: String,
	avatarUrl: String,
});

export const ContactModel = model<IContact>("Contact", ContactSchema);

export default ContactModel;
