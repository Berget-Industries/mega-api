import { model, Schema } from "mongoose";

export interface Allergy {
	count: number;
	combination: string[];
}
export interface BaseCourse {
	type: string;
	name: string;
	count: number;
	allergies: Allergy[];
}

export interface Course extends BaseCourse {
	options?: BaseCourse[];
}

export type Drinks = {
	type: string;
	count: number;
};

export interface Menu {
	starter: Course;
	main: Course;
	dessert: Course;
	drinks: Drinks[];
	comment: string;
}

interface IReservationChambreDetails {
	name: string;
	email: string;
	numberOfGuests: number;
	date: Date;
	time: string;
	phone: string;
	menu: Menu;
	comment: string;
}

const ReservationChambreScheme = new Schema<IReservationChambreDetails>({
	name: { type: String },
	email: { type: String },
	date: { type: Date },
	time: { type: String },
	numberOfGuests: { type: Number },
	phone: { type: String },
	menu: { type: Object },
	comment: { type: String },
});

export const ChambreReservation = model<IReservationChambreDetails>(
	"ReservationChambreDetails",
	ReservationChambreScheme
);

export default ReservationChambreScheme;
