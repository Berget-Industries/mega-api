import { model, Schema } from "mongoose";

interface IAvailableDateDetails {
	_id: string;
	date: Date;
	lunch: any;
	dinner: any;
}

const AvailableDateScheme = new Schema<IAvailableDateDetails>({
	date: { type: String },
	lunch: { type: Object },
	dinner: { type: Object },
});

export const AvailableDate = model<IAvailableDateDetails>("AvailableDates", AvailableDateScheme);

export default AvailableDateScheme;
