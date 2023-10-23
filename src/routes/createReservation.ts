import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/ReservationModel.ts";
const router = new Router();
import {
	getCreateReservationSuccessMessage,
	getCreateReservationErrorMessage,
	getMissingInformationErrorMessage,
} from "../utils/errorMessages.ts";

async function createReservation(ctx: Context) {
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
			.filter(([v]) => v == null || v === "")
			.map(([k]) => k);

		if (isNull.length > 0) {
			const body = getMissingInformationErrorMessage(isNull.toString());
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const reservationDetails = await Reservation.create(input);

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

router.post("/createReservation", createReservation);

export default router;
