import { model, Schema } from "npm:mongoose";

export interface IAvailableTimeOfDay {
	isAvailable: boolean;
	_id: string | null;
}

export interface IAvailableDateDetails {
	_id: string;
	date: Date;
	lunch: IAvailableTimeOfDay;
	dinner: IAvailableTimeOfDay;
}

export default model<IAvailableDateDetails>(
	"AvailableDates",
	new Schema<IAvailableDateDetails>({
		date: { type: Date, unique: true },
		lunch: { type: Object },
		dinner: { type: Object },
	})
);
