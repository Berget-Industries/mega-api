import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import checkBookingRules from "../utils/checkBookingRules.ts";
import { editResSuccessMsg, invalidIDErrMsg, notAvailableErrMsg } from "../utils/errorMessages.ts";
import { checkAvailableDates, editReservationFromDate } from "../utils/availableDates.ts";
import { Types } from "npm:mongoose";
import mongoose from "mongoose";
const router = new Router();

async function editChambreReservation(ctx: Context) {
	try {
		const {
			_id,
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
			allergies,
			menu,
			starters,
			mains,
			desserts,
			drinks,
			comment,
			other,
		} = await ctx.request.body().value;

		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
			allergies,
			menu,
			starters,
			mains,
			desserts,
			drinks,
			comment,
			other,
		};

		const checkIfIDExist = await ChambreReservation.findOne({ _id });

		if ((!_id && !Types.ObjectId.isValid(_id)) || !checkIfIDExist) {
			ctx.response.status = 200;
			ctx.response.body = invalidIDErrMsg;
			return;
		}

		const result = checkAvailableDates(date, time, _id);
		if ((await result) === "Kan inte bokas") {
			ctx.response.status = 500;
			ctx.response.body = notAvailableErrMsg;
			return;
		}

		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		const rulesPassed = checkBookingRules(input, ctx);
		if (!rulesPassed) {
			return;
		}

		await editReservationFromDate(_id, time, date);

		const reservationDetails = await ChambreReservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData },
			{ new: true }
		);

		const response = {
			...editResSuccessMsg,
			reservationData: reservationDetails,
		};

		console.log(response);
		ctx.response.status = 200;
		ctx.response.body = response;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			ctx.response.status = 400;
			ctx.response.body = invalidIDErrMsg;
			console.log(invalidIDErrMsg);
			return;
		}
		console.log(invalidIDErrMsg);
		ctx.response.status = 500;
		ctx.response.body = invalidIDErrMsg;
		console.log("Fel inträffade: ", error);
	}
}

router.post("/editChambreReservation", editChambreReservation);

export default router;
