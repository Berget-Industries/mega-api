import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { deleteReservationFromDate } from "../utils/availableDates.ts";
import { missingIdErrMsg, invalidIDErrMsg, deleteResSuccessMsg } from "../utils/errorMessages.ts";
import mongoose from "mongoose";
const router = new Router();

async function deleteChambreReservation(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;
		const input = {
			_id,
		};

		if (!input._id) {
			missingIdErrMsg;
			return (
				(ctx.response.status = 200),
				(ctx.response.body = missingIdErrMsg),
				console.log(missingIdErrMsg)
			);
		}
		await deleteReservationFromDate(_id);

		const reservationDetails = await ChambreReservation.findOneAndDelete(input);

		if (!reservationDetails) {
			return (
				(ctx.response.status = 200),
				(ctx.response.body = invalidIDErrMsg),
				console.log(invalidIDErrMsg)
			);
		}

		const response = {
			...deleteResSuccessMsg,
			reservationDetails: reservationDetails,
		};

		console.log(response);
		ctx.response.status = 200;
		ctx.response.body = response;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			return (
				(ctx.response.status = 400),
				(ctx.response.body = invalidIDErrMsg),
				console.log(invalidIDErrMsg)
			);
		}
		console.log(invalidIDErrMsg);
		ctx.response.status = 500;
		ctx.response.body = invalidIDErrMsg;
		console.log("Fel inträffade: ", error);
	}
}

router.post("/deleteChambreReservation", deleteChambreReservation);

export default router;
