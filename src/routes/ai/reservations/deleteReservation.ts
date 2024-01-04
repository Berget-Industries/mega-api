import mongoose from "npm:mongoose";
import { Reservation } from "../../../models/index.ts";
import { deleteReservationFromDate } from "../../../utils/availableDates.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";
import apiKeyAuthenticationMiddleware from "../../../middleware/apiKeyAuthenticationMiddleware.ts";

const router = new Router();
router.post("/delete", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { _id } = await ctx.request.body().value;
		const input = {
			_id,
		};

		if (!input._id) {
			handleResponseSuccess(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}

		const reservationDetails = await Reservation.findOneAndDelete(input);
		if (!reservationDetails) {
			handleResponseSuccess(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
			});
			return;
		}

		deleteReservationFromDate({
			reservation: _id,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Reservationen har tagits bort.",
			reservationData: reservationDetails,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseSuccess(ctx, {
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
