import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import mongoose from "mongoose";
const router = new Router();
const errRes = {
	status: "not-found",
	message: "Det angivna ID:et finns inte eller så är det ogiltigt.",
};

async function deleteChambreReservation(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;
		const input = {
			_id,
		};

		if (!input._id) {
			const message = {
				status: "missing-id",
				message: "Saknar reservations id.",
			};
			return (ctx.response.status = 404), (ctx.response.body = message), console.log(message);
		}

		const reservationDetails = await ChambreReservation.findOneAndDelete(input);
		if (!reservationDetails) {
			return (ctx.response.status = 404), (ctx.response.body = errRes), console.log(errRes);
		}

		const response = {
			status: "success",
			message: "Reservationen har avbokats!",
			reservationDetails: reservationDetails,
		};

		console.log(response);
		ctx.response.status = 201;
		ctx.response.body = response;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			return (ctx.response.status = 400), (ctx.response.body = errRes), console.log(errRes);
		}
		console.log(errRes);
		ctx.response.status = 500;
		ctx.response.body = errRes;
		console.log("Fel inträffade: ", error);
	}
}

router.post("/deleteChambreReservation", deleteChambreReservation);

export default router;
