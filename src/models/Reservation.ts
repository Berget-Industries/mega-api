import { model, Schema, Types } from "npm:mongoose";

export interface IReservationDetails {
	chambre: boolean;
	name: string;
	email: string;
	phone: string;
	date: Date;
	numberOfGuests: number;
	comment: string;
	menu: object | undefined;
	conversations: Types.ObjectId[];
	organization: Types.ObjectId;
}

export default model<IReservationDetails>(
	"ReservationDetails",
	new Schema<IReservationDetails>({
		chambre: { type: Boolean },
		name: { type: String },
		email: { type: String },
		phone: { type: String },
		date: { type: Date },
		numberOfGuests: { type: Number },
		comment: { type: String },
		menu: { type: Object },
		conversations: [{ type: Types.ObjectId, ref: "Conversation" }],
		organization: { type: Types.ObjectId, ref: "Organization" },
	})
);
