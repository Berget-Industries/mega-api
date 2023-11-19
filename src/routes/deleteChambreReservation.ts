import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { deleteReservationFromDate } from "../utils/availableDates.ts";
import {
	getMissingIdErrorMessage,
	getInvalidIdErrorMessage,
	getDeleteReservationErrorMessage,
	getDeleteReservationSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
const router = new Router();

async function deleteChambreReservation(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;
		const input = {
			_id,
		};

		if (!input._id) {
			const body = getMissingIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		await deleteReservationFromDate({ reservationId: _id });
		const reservationDetails = await ChambreReservation.findOneAndDelete(input);

		if (!reservationDetails) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const body = getDeleteReservationSuccessMessage(reservationDetails);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getMissingIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getDeleteReservationErrorMessage();
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log(error);
		return;
	}
}

router.post("/deleteChambreReservation", deleteChambreReservation);

export default router;
