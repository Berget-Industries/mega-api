import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

async function getReservationData(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;

		if (!_id) {
			const body = getMissingIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		const reservationDetails = await Reservation.findById(_id);

		const body = getReservationDataSuccessMessage(reservationDetails);
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		handleResponseError(ctx, body);
	}
}

router.post("/getReservationData", getReservationData);

export default router;
