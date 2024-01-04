import mongoose from "npm:mongoose";
import convertToUTC from "../../../utils/convertToUTC.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation, Conversation } from "../../../models/index.ts";
import apiKeyAuthenticationMiddleware from "../../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";
import { checkAvailableDates, editReservationFromDate } from "../../../utils/availableDates.ts";
import {
	checkChambreBookingRules,
	checkNormalBookingRules,
} from "../../../utils/checkBookingRules.ts";

const router = new Router();
router.post("/edit", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { _id, name, email, date, time, numberOfGuests, phone, conversation } =
			await ctx.request.body().value;

		const input = {
			name,
			email,
			date: convertToUTC(date, time),
			numberOfGuests,
			phone,
		};

		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		if (Object.keys(updateData).length === 0) {
			handleResponseSuccess(ctx, {
				status: "no-change",
				message: "Allt gick som det skulle men inget ändrades i reservationen.",
			});
			return;
		}

		const chambre = (await Reservation.findById(_id))?.chambre;
		const brokenRules = chambre
			? checkChambreBookingRules({ ...input, time })
			: checkNormalBookingRules({ ...input, time });
		const brokenRulesMessage =
			brokenRules.length > 0
				? brokenRules
						.map(
							({ inputKey, message }) =>
								`Bruten regel för värde av ${inputKey}: ${message}.`
						)
						.join("\n")
				: "Alla regler följs.";
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
				? "Tid och eller datum saknas."
				: isAvailable === false
				? {
						status: "not-available",
						message: "Tiden är inte ledig.",
				  }
				: "Önskad tid går att boka.";

		const responseBody = `
====
${JSON.stringify(brokenRulesMessage)}
====
${JSON.stringify(isAvailableMessage)}
====
`;

		if (brokenRules.length > 0 || !isAvailable) {
			handleResponseSuccess(ctx, responseBody);
			return;
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id },
			{ $set: updateData, $addToSet: { conversations: conversation } },
			{ new: true }
		);
		editReservationFromDate({
			reservation: _id,
			date,
			time,
		});

		// let conversation = await ConversationModel.findById(conversationId);
		// if (!conversation) {
		// 	conversation = await ConversationModel.create({
		// 		_id: conversationId,
		// 		organizationId: "",
		// 		contactId: "",
		// 		messages: [],
		// 		lastActivity: new Date(),
		// 		actions: [],
		// 	});
		// }

		// conversation.actions = [
		// 	...conversation.actions,
		// 	{
		// 		type: "editReservation",
		// 		docId: conversationId,
		// 		date: new Date(),
		// 	},
		// ];
		console.log(reservationDetails);
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Reservationen har uppdaterats.",
			reservationData: reservationDetails,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseSuccess(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
			});
			return;
		}
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
});

export default router;
