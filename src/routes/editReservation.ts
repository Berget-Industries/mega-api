import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/ReservationModel.ts";
import mongoose from "mongoose";
import {
	getEditReservationErrorMessage,
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationNoChangeMessage,
} from "../utils/errorMessages.ts";

const router = new Router();
async function editReservation(ctx: Context) {
	try {
		const { _id, name, email, date, time, numberOfGuests, phone } = await ctx.request.body()
			.value;
		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
		};

		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		if (Object.keys(updateData).length === 0) {
			const body = getEditReservationNoChangeMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			return;
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData },
			{ new: true }
		);

		const body = getEditReservationSuccessMessage(reservationDetails);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post("/editReservation", editReservation);

export default router;
