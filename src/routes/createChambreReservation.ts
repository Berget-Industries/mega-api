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
		const missingInformationMessage =
			missingInformation.length > 0
				? getMissingInformationErrorMessage(missingInformation.toString())
				: "det saknas ingen information";

		const brokenRules = checkChambreBookingRules(input);
		const brokenRulesMessage =
			brokenRules.length > 0 ? getBrokenRulesErrorMessage(brokenRules) : "alla regler följs";

		const isDateAndTimeRulesBroken = brokenRules.filter(
			(_) => _.inputKey === "time" || "date"
		).length;
		console.log(isDateAndTimeRulesBroken);
		const isAvailable =
			date && time && isDateAndTimeRulesBroken === 0
				? await checkAvailableDates({ date, time })
				: null;
		const isAvailableMessage =
			isAvailable === null
				? "tid och eller datum saknas"
				: isAvailable === false
				? getNotAvailableErrorMessage()
				: "önskad tid går att boka";

		const responseBody = `
====
${JSON.stringify(missingInformationMessage)}
====
${JSON.stringify(brokenRulesMessage)}
====
${JSON.stringify(isAvailableMessage)}
====
`;

		if (missingInformation.length > 0 || brokenRules.length > 0 || !isAvailable) {
			ctx.response.status = 200;
			ctx.response.body = responseBody;
			console.log(responseBody);
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
