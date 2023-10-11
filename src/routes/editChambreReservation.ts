import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import checkBookingRules from "../utils/checkBookingRules.ts";
<<<<<<< HEAD
import { editResSuccessMsg, invalidIDErrMsg } from "../utils/errorMessages.ts";
import mongoose from "mongoose";
=======
import { Types } from "npm:mongoose";
>>>>>>> 60e84ed9fddb177438111549143467f4328f7fb7
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

		if (!_id && !Types.ObjectId.isValid(_id)) {
			ctx.response.status = 200;
			ctx.response.body = {
				status: "invalid-id",
				message: "Kunde inte hitta reservation. Ogiltigt bokningsnummer.",
			};

			return;
		}
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

		const reservationDetails = await ChambreReservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData },
			{ new: true }
		);

		if (!reservationDetails) {
			return (
				(ctx.response.status = 200),
				(ctx.response.body = invalidIDErrMsg),
				console.log(invalidIDErrMsg)
			);
		}

		const response = {
			...editResSuccessMsg,
			reservationData: reservationDetails,
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

router.post("/editChambreReservation", editChambreReservation);

export default router;
