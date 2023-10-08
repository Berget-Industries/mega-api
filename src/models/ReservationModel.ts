import { model, Schema } from "mongoose";

interface IReservationDetails {
    name: string;
    email: string;
    date: Date;
    time: string;
    numberOfGuests: number;
}

const ReservationScheme = new Schema<IReservationDetails>({
    name: {type: String},
    email: {type: String},
    date: {type: Date},
    time: {type: String},
    numberOfGuests: {type: Number},
});

export const Reservation = model<IReservationDetails>('ReservationDetails', ReservationScheme);

export default ReservationScheme
