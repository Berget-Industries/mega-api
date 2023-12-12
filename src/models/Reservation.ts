import { model, Schema, Types } from "npm:mongoose";

export interface IReservationDetails {
	chambre: boolean;
	date: Date;
	numberOfGuests: number;
	comment: string;
	menu: object | undefined;
	conversations: Types.ObjectId[];
	organization: Types.ObjectId;
	contact: Types.ObjectId;
}

export default model<IReservationDetails>(
	"ReservationDetails",
	new Schema<IReservationDetails>({
		chambre: { type: Boolean },
		date: { type: Date },
		numberOfGuests: { type: Number },
		comment: { type: String },
		menu: { type: Object },
		conversations: [{ type: Types.ObjectId, ref: "Conversation" }],
		organization: { type: Types.ObjectId, ref: "Organization" },
		contact: { type: Types.ObjectId, ref: "Contact" },
	})
);
