import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import { checkAvailableDates, addReservationToDate } from "../utils/availableDates.ts";
import { checkChambreBookingRules } from "../utils/checkBookingRules.ts";
import {
	getMissingInformationErrorMessage,
	getCreateReservationSuccessMessage,
	getNotAvailableErrorMessage,
	getCreateReservationErrorMessage,
	getBrokenRulesErrorMessage,
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

		if (isNull.length > 0) {
			const body = getMissingInformationErrorMessage(isNull.toString());
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const brokenRules = checkChambreBookingRules(input);
		if (brokenRules.length > 0) {
			const body = getBrokenRulesErrorMessage(brokenRules);
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const result = await checkAvailableDates(date, time, _id);
		if (result === "Kan inte bokas") {
			const body = getNotAvailableErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDetails = await ChambreReservation.create(input);
		const addToDate = {
			_id: reservationDetails._id.toString(),
		};

		await addReservationToDate(date, time, addToDate);
		const body = getCreateReservationSuccessMessage(reservationDetails);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		const body = getCreateReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post("/createChambreReservation", createChambreReservation);

export default router;
