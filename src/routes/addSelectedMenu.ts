import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import {
	getEditReservationSuccessMessage,
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
const router = new Router();

async function editChambreReservation(ctx: Context) {
	try {
		const { _id, menu } = await ctx.request.body().value;

		const reservationDoc = await ChambreReservation.findById(_id);
		if (!reservationDoc) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDetails = await ChambreReservation.findOneAndUpdate(
			{ _id },
			{ $set: { menu } },
			{ new: true }
		);

		const body = getEditReservationSuccessMessage(reservationDetails);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			console.error(error);
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post("/addSelectedMenu", editChambreReservation);

export default router;
