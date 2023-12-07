import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../../models/index.ts";
import mongoose from "mongoose";
import {
	getDeleteReservationErrorMessage,
	getMissingIdErrorMessage,
	getDeleteReservationSuccessMessage,
	getInvalidIdErrorMessage,
} from "../../utils/errorMessages.ts";

import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { deleteReservationFromDate } from "../../utils/availableDates.ts";

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
		await deleteReservationFromDate({
			reservationId: _id,
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
