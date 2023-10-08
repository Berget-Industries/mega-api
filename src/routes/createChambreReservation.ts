import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
const router = new Router();
import checkBookingRules from "../utils/checkBookingRules.ts";

async function createChambreReservation(ctx: Context) {
	try {
		const { name, email, date, time, numberOfGuests } = await ctx.request.body().value;
		const input = {
			name,
			email,
			date,
			time,
			numberOfGuests,
		};

		const isNull = Object.entries(input)
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);

		const missingInfo = {
			status: "missing-information",
			message:
				"Det gick inte att skapa reservationen. Följande information saknas: " +
				isNull.toString(),
		};

		if (isNull.length > 0) {
			ctx.response.status = 206;
			ctx.response.body = missingInfo;
			console.log(missingInfo);
			return;
		}

		const rulesPassed = checkBookingRules(input, ctx);
		if (!rulesPassed) {
			return;
		}

		const reservationDetails = await ChambreReservation.create(input);
		const response = {
			status: "success",
			message: "Reservationen har bokats!",
			reservationData: reservationDetails,
		};

		console.log(response);
		ctx.response.status = 201;
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
