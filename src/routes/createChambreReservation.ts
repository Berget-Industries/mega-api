import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { checkAvailableDates, addReservationToDate } from "../utils/availableDates.ts";
import checkBookingRules from "../utils/checkBookingRules.ts";
import {
	missingInfoErrMsg,
	createResSuccessMsg,
	notAvailableErrMsg,
} from "../utils/errorMessages.ts";
const router = new Router();

async function createChambreReservation(ctx: Context) {
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
		};

		const isNull = Object.entries({
			name,
			email,
			numberOfGuests,
			date,
			time,
			phone,
		})
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);
		missingInfoErrMsg.message + isNull.toString();

		if (isNull.length > 0) {
			ctx.response.status = 200;
			ctx.response.body = missingInfoErrMsg;
			console.log(missingInfoErrMsg);
			return;
		}

		const rulesPassed = checkBookingRules(input, ctx);
		if (!rulesPassed) {
			return;
		}

		const result = checkAvailableDates(date, time, _id);
		if ((await result) === "Kan inte bokas") {
			ctx.response.status = 500;
			ctx.response.body = notAvailableErrMsg;
			return;
		}

		const reservationDetails = await ChambreReservation.create(input);
		const addToDate = {
			_id: reservationDetails._id.toString(),
		};

		await addReservationToDate(date, time, addToDate);
		const response = {
			...createResSuccessMsg,
			reservationDetails: reservationDetails,
		};
		console.log(response);
		ctx.response.status = 200;
		ctx.response.body = response;
	} catch (error) {
		const errRes = {
			status: "internal-error",
			message: "Kunde inte skapa reservation",
		};
		console.log(errRes);
		ctx.response.status = 500;
		ctx.response.body = errRes;
		console.log("Fel inträffade: ", error);
	}
}

router.post("/createChambreReservation", createChambreReservation);

export default router;
