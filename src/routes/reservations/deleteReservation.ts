import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../../models/index.ts";
import mongoose from "mongoose";
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
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}

		const reservationDetails = await Reservation.findOneAndDelete(input);
		if (!reservationDetails) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
			});
			return;
		}
		deleteReservationFromDate({
			reservationId: _id,
		});
		console.log(reservationDetails);
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Reservationen har tagits bort.",
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
		return;
	}
});

export default router;
