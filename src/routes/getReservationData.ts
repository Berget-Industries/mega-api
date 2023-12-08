import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/index.ts";
import mongoose from "mongoose";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

async function getReservationData(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;

		if (!_id) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}

		const reservationDetails = await Reservation.findById(_id);
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Reservation har hämtats.",
			reservationData: reservationDetails,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
			});
			return;
		}
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
}

router.post("/getReservationData", getReservationData);

export default router;
