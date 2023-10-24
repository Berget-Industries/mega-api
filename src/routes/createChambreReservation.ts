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
		const { name, email, date, time, numberOfGuests, phone, comment } = await ctx.request.body()
			.value;
		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
			comment,
		};

		const missingInformation = Object.entries({
			name,
			email,
			date,
			time,
			numberOfGuests,
			phone,
		})
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);

		if (missingInformation.length > 0) {
			const body = getMissingInformationErrorMessage(missingInformation.toString());
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

		const isAvailable = await checkAvailableDates({ date, time });
		if (!isAvailable) {
			const body = getNotAvailableErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDetails = await ChambreReservation.create(input);
		await addReservationToDate({
			date,
			time,
			reservationId: reservationDetails._id.toString(),
		});

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
