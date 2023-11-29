import { model, Schema } from "mongoose";

export interface Contact {
	status: string;
	role: string;
	email: string;
	name: string;
	lastActivity: Date;
	address: string;
	avatarUrl: string;
	phoneNumber: string;
}

export const ContactSchema = new Schema<Contact>({
	status: { type: String },
	role: { type: String },
	email: { type: String },
	name: { type: String },
	lastActivity: { type: Date },
	address: { type: String },
	avatarUrl: { type: String },
	phoneNumber: { type: String },
});

export const Contact = model<Contact>("Contact", ContactSchema);

export default Contact;
