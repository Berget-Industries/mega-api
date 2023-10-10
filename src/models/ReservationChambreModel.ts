import { model, Schema } from "mongoose";
export type Course = {
	name: string;
	count: number;
};
export type Allergi = {
	type: string;
	count: number;
};
export type Drinks = {
	type: string;
	count: number;
};

interface IReservationChambreDetails {
	name: string;
	email: string;
	numberOfGuests: number;
	date: Date;
	time: string;
	phone: string;
	allergies: Allergi[];
	menu: string;
	starters: Course[];
	mains: Course[];
	dessert: Course[];
	drinks: Drinks[];
	comment: string;
	other: string;
}

const ReservationChambreScheme = new Schema<IReservationChambreDetails>({
	name: { type: String },
	email: { type: String },
	date: { type: Date },
	time: { type: String },
	numberOfGuests: { type: Number },
	phone: { type: String },
	allergies: { type: Array },
	menu: { type: String },
	starters: { type: Array },
	mains: { type: Array },
	dessert: { type: Array },
	drinks: { type: Array },
	comment: { type: String },
	other: { type: String },
});

export const ChambreReservation = model<IReservationChambreDetails>(
	"ReservationChambreDetails",
	ReservationChambreScheme
);

export default ReservationChambreScheme;
