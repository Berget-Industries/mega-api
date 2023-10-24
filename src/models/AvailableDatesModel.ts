import { model, Schema } from "mongoose";

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

const AvailableDateScheme = new Schema<IAvailableDateDetails>({
	date: { type: Date, unique: true },
	lunch: { type: Object },
	dinner: { type: Object },
});

export const AvailableDate = model<IAvailableDateDetails>("AvailableDates", AvailableDateScheme);

export default AvailableDate;
