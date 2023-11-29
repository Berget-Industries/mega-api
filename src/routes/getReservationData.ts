import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/Reservation.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
const router = new Router();

async function getReservationData(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;

		if (!_id) {
			const body = getMissingIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDetails = await Reservation.findById(_id);

		const body = getReservationDataSuccessMessage(reservationDetails);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 400;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post("/getReservationData", getReservationData);

export default router;
