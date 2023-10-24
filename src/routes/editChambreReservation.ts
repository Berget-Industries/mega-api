import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { checkChambreBookingRules } from "../utils/checkBookingRules.ts";
import {
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
	getBrokenRulesErrorMessage,
	getNotAvailableErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import { checkAvailableDates, editReservationFromDate } from "../utils/availableDates.ts";
const router = new Router();

async function editChambreReservation(ctx: Context) {
	try {
		const {
			_id,
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,

			comment,
		} = await ctx.request.body().value;

		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
			comment,
		};

		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		const brokenRules = checkChambreBookingRules(input);
		if (brokenRules.length > 0) {
			const body = getBrokenRulesErrorMessage(brokenRules);
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDoc = await ChambreReservation.findById(_id);
		if (!reservationDoc) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		if (date || time) {
			const newDate = date ? new Date(date) : reservationDoc.date;
			const newTime = time ? time : reservationDoc.time;

			const isNewDateAvailable = await checkAvailableDates({ date: newDate, time: newTime });
			if (!isNewDateAvailable) {
				const body = getNotAvailableErrorMessage();
				ctx.response.status = 200;
				ctx.response.body = body;
				console.log(body);
				return;
			}

			await editReservationFromDate({ reservationId: _id, date: newDate, time: newTime });
		}

		const reservationDetails = await ChambreReservation.findOneAndUpdate(
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
			console.error(error);
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

router.post("/editChambreReservation", editChambreReservation);

export default router;
