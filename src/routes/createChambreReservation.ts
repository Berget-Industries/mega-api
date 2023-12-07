import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import checkBookingRules from "../utils/checkBookingRules.ts";
import { missingInfoErrMsg, createResSuccessMsg } from "../utils/errorMessages.ts";
const router = new Router();

async function createChambreReservation(ctx: Context) {
	try {
		const {
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

		console.log(isNull);

		if (isNull.length > 0) {
			const body = {
				...missingInfoErrMsg,
				message: missingInfoErrMsg.message + isNull.toString(),
			};

			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const rulesPassed = checkBookingRules(input, ctx);
		if (!rulesPassed) {
			return;
		}

		const reservationDetails = await ChambreReservation.create(input);
		const response = {
			...createResSuccessMsg,
			reservationData: reservationDetails,
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
