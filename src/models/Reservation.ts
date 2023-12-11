import { model, Schema } from "npm:mongoose";

export interface IReservationDetails {
	chambre: boolean;
	date: Date;
	numberOfGuests: number;
	comment: string;
	menu: object | undefined;
	conversations: [{ type: Schema.Types.ObjectId; ref: "Conversation" }];
	organization: { type: Schema.Types.ObjectId; ref: "Organization" };
	contact: { type: Schema.Types.ObjectId; ref: "Contact" };
}

export default model<IReservationDetails>(
	"ReservationDetails",
	new Schema<IReservationDetails>({
		chambre: { type: Boolean },
		date: { type: Date },
		numberOfGuests: { type: Number },
		comment: { type: String },
		menu: { type: Object },
		conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
		organization: { type: Schema.Types.ObjectId, ref: "Organization" },
		contact: { type: Schema.Types.ObjectId, ref: "Contact" },
	})
);
