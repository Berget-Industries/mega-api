import mongoose from "mongoose";
import { Reservation } from "../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/getReservationData", async (ctx: Context) => {
	try {
		const { _id } = await ctx.request.body().value;
		if (!_id) {
			handleResponseSuccess(ctx, {
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
	}
});

export default router;
