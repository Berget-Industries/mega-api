import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/ReservationModel.ts";
import mongoose from "mongoose";
import {
	getDeleteReservationErrorMessage,
	getMissingIdErrorMessage,
	getDeleteReservationSuccessMessage,
	getInvalidIdErrorMessage,
} from "../utils/errorMessages.ts";

const router = new Router();
async function deleteReservation(ctx: Context) {
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

		const reservationDetails = await Reservation.findOneAndDelete(input);
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
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getDeleteReservationErrorMessage();
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		return;
	}
}

router.post("/deleteReservation", deleteReservation);

export default router;
