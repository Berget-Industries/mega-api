import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { missingIdErrMsg, invalidIDErrMsg, getDataSuccessMsg } from "../utils/errorMessages.ts";
import mongoose from "mongoose";
const router = new Router();

async function getReservationData(ctx: Context) {
	try {
		const { _id } = await ctx.request.body().value;

		if (!_id) {
			missingIdErrMsg;
			return (
				(ctx.response.status = 200),
				(ctx.response.body = missingIdErrMsg),
				console.log(missingIdErrMsg)
			);
		}

		const getData = await ChambreReservation.findById(_id);
		const response = {
			...getDataSuccessMsg,
			reservationData: getData,
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

router.post("/getReservationData", getReservationData);

export default router;
