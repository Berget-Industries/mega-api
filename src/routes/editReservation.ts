import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/ReservationModel.ts";
import mongoose from "mongoose";
const router = new Router();
const missingIDRes = {
	status: "not-found",
	message: "Det angivna ID:et finns inte eller så är det ogiltigt.",
};

async function editReservation(ctx: Context) {
	const nonChanged = {
		status: "non-changed",
		message: "Inget har ändrats i reservationen.",
	};
	try {
		const { _id, name, email, date, time, numberOfGuests } = await ctx.request.body().value;
		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
		};

		const updateData: Record<string, any> = {};

		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		if (Object.keys(updateData).length === 0) {
			ctx.response.status = 200;
			ctx.response.body = nonChanged;
			return;
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData },
			{ new: true }
		);

		const response = {
			status: "success",
			message: "Reservationen har blivit ändrad.",
			reservationData: reservationDetails,
		};

		console.log(response);
		ctx.response.status = 201;
		ctx.response.body = response;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			return (ctx.response.status = 404), (ctx.response.body = missingIDRes);
		}
		const errmsg = {
			status: "internal-error",
			message: "Kunde inte ändra reservationen.",
		};
		console.log(errmsg);
		ctx.response.status = 500;
		ctx.response.body = errmsg;
		console.log("Fel inträffade: ", error);
	}
}

router.post("/editReservation", editReservation);

export default router;
