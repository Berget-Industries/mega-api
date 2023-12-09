import mongoose from "mongoose";
import { Reservation } from "../../models/index.ts";
import { deleteReservationFromDate } from "../../utils/availableDates.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import {
	getDeleteReservationErrorMessage,
	getMissingIdErrorMessage,
	getDeleteReservationSuccessMessage,
	getInvalidIdErrorMessage,
} from "../../utils/errorMessages.ts";

const router = new Router();
router.post("/reservation/delete", async (ctx: Context) => {
	try {
		const { _id } = await ctx.request.body().value;
		const input = {
			_id,
		};

		if (!input._id) {
			const body = getMissingIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		const reservationDetails = await Reservation.findOneAndDelete(input);
		if (!reservationDetails) {
			const body = getInvalidIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		deleteReservationFromDate({
			reservation: _id,
		});

		const body = getDeleteReservationSuccessMessage(reservationDetails);
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}
		const body = getDeleteReservationErrorMessage();
		handleResponseError(ctx, body);
		return;
	}
});

export default router;
