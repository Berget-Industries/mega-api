import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/index.ts";
import {
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

router.post("/addSelectedMenu", async (ctx: Context) => {
	try {
		const { _id, menu } = await ctx.request.body().value;

		const reservationDoc = await Reservation.findById(_id);
		if (!reservationDoc) {
			const body = getInvalidIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id },
			{ $set: { menu } },
			{ new: true }
		);

		const body = getEditReservationSuccessMessage(reservationDetails);
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		handleResponseError(ctx, body);
	}
});

export default router;
