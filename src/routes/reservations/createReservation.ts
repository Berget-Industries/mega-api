import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation, Conversation } from "../../models/index.ts";
import moment from "npm:moment-timezone";
const router = new Router();
import {
	getCreateReservationSuccessMessage,
	getCreateReservationErrorMessage,
	getMissingInformationErrorMessage,
	getNotAvailableErrorMessage,
	getBrokenRulesErrorMessage,
} from "../../utils/errorMessages.ts";

import { checkAvailableDates, addReservationToDate } from "../../utils/availableDates.ts";
import {
	checkChambreBookingRules,
	checkNormalBookingRules,
} from "../../utils/checkBookingRules.ts";
import { IReservationDetails } from "../../models/Reservation.ts";

router.post("/reservation/create", async (ctx: Context) => {
	try {
		const { chambre, name, email, date, time, numberOfGuests, phone, comment, conversationId } =
			await ctx.request.body().value;

		const combinedDate = new Date(`${date}T${time}`);
		const utcDateTime = new Date(
			combinedDate.getTime() - combinedDate.getTimezoneOffset() * 60000
		);
		// const dateInUTC = new Date(
		// 	combinedDate.getTime() - combinedDate.getTimezoneOffset() * 60000
		// );

		const input: IReservationDetails = {
			chambre,
			name,
			email,
			date: utcDateTime,
			numberOfGuests,
			phone,
			comment,
			menu: undefined,
			conversations: [conversationId],
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

		const brokenRules = chambre
			? checkChambreBookingRules({ ...input, time })
			: checkNormalBookingRules({ ...input, time });
		const brokenRulesMessage =
			brokenRules.length > 0 ? getBrokenRulesErrorMessage(brokenRules) : "alla regler följs";

		const isDateAndTimeRulesBroken = brokenRules.filter(
			(_) => _.inputKey === "time" || "date"
		).length;
		const isAvailable =
			date && time && isDateAndTimeRulesBroken === 0
				? chambre
					? await checkAvailableDates({ date, time })
					: true
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

		const reservationDetails = await Reservation.create(input);
		await addReservationToDate({
			date,
			time,
			reservationId: reservationDetails._id.toString(),
		});

		// let conversation = await ConversationModel.findById(conversationId);
		// if (!conversation) {
		// 	conversation = await ConversationModel.create({
		// 		_id: conversationId,
		// 		lastActivity: new Date(),
		// 	});
		// }

		// conversation.actions = [
		// 	...conversation.actions,
		// 	{
		// 		type: chambre ? "createChambreReservation" : "createReservation",
		// 		docId: conversationId,
		// 		date: new Date(),
		// 	},
		// ];

		// await conversation.save();

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
});

export default router;
