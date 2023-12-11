import { model, Schema, Types } from "npm:mongoose";

export interface IReservationDetails {
	chambre: boolean;
	name: string;
	email: string;
	date: Date;
	numberOfGuests: number;
	phone: string;
	comment: string;
	menu: object | undefined;
	conversations: Types.ObjectId;
	organization: Types.ObjectId;
}

export default model<IReservationDetails>(
	"ReservationDetails",
	new Schema<IReservationDetails>({
		chambre: { type: Boolean },
		name: { type: String },
		email: { type: String },
		date: { type: Date },
		numberOfGuests: { type: Number },
		comment: { type: String },
		phone: { type: String },
		menu: { type: Object },
		conversations: [{ type: Types.ObjectId, ref: "Conversation" }],
		organization: { type: Types.ObjectId, ref: "Organization" },
	})
);
