import { model, Schema } from "mongoose";

interface IReservationChambreDetails {
    name: string;
    email: string;
    date: Date;
    time: string;
    numberOfGuests: number;
}

const ReservationChambreScheme = new Schema<IReservationChambreDetails>({
    name: {type: String, required: true},
    email: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    numberOfGuests: {type: Number, required: true},
});

export const ChambreReservation = model<IReservationChambreDetails>('ReservationChambreDetails', ReservationChambreScheme);

export default ReservationChambreScheme
