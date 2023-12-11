import { model, Schema } from "npm:mongoose";

export interface IReservationDetails {
	chambre: boolean;
	name: string;
	email: string;
	date: Date;
	numberOfGuests: number;
	phone: string;
	comment: string;
	menu: object | undefined;
	conversations: [{ type: Schema.Types.ObjectId; ref: "Conversation" }];
	organization: { type: Schema.Types.ObjectId; ref: "Organization" };
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
		conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
		organization: { type: Schema.Types.ObjectId, ref: "Organization" },
	})
);
