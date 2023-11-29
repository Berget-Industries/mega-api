import { model, Schema } from "mongoose";

export interface IReservationDetails {
	chambre: boolean;
	name: string;
	email: string;
	date: Date;
	time: string;
	numberOfGuests: number;
	phone: string;
	comment: string;
	menu: object;
}

export const ReservationScheme = new Schema<IReservationDetails>({
	chambre: { type: Boolean },
	name: { type: String },
	email: { type: String },
	date: { type: Date },
	time: { type: String },
	numberOfGuests: { type: Number },
	comment: { type: String },
	phone: { type: String },
	menu: { type: Object },
});

export const Reservation = model<IReservationDetails>("ReservationDetails", ReservationScheme);

export default ReservationScheme;
