import convertToUTC from "../../../utils/convertToUTC.ts";
import { IReservationDetails } from "../../../models/Reservation.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation, Conversation, Contact } from "../../../models/index.ts";
import apiKeyAuthenticationMiddleware from "../../../middleware/apiKeyAuthenticationMiddleware.ts";
import { handleResponseSuccess, handleResponseError } from "../../../utils/contextHandler.ts";
import { checkAvailableDates, addReservationToDate } from "../../../utils/availableDates.ts";
import {
	checkChambreBookingRules,
	checkNormalBookingRules,
} from "../../../utils/checkBookingRules.ts";

const router = new Router();
router.post("/create", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { chambre, name, email, date, time, numberOfGuests, phone, comment, conversation } =
			await ctx.request.body().value;

		let contactDoc = await Contact.findOne({ email: email });
		if (!contactDoc) {
			contactDoc = await Contact.create({
				email: email,
				name: name,
				phoneNumber: phone,
			});
		}

		const input = {
			chambre,
			date: convertToUTC(date, time),
			numberOfGuests,
			comment,
			menu: undefined,
			conversations: [conversation],
			contact: contactDoc._id,
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
				? {
						status: "missing-information",
						message:
							"Det gick inte att skapa reservationen. Följande information saknas: " +
							missingInformation.toString(),
				  }
				: "Det saknas ingen information.";

		const brokenRules = chambre
			? checkChambreBookingRules({ ...input, time })
			: checkNormalBookingRules({ ...input, time });
		const brokenRulesMessage =
			brokenRules.length > 0
				? brokenRules
						.map(
							({ inputKey, message }) =>
								`Bruten regel för värde av ${inputKey}: ${message}`
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
${JSON.stringify(missingInformationMessage)}
====
${JSON.stringify(brokenRulesMessage)}
====
${JSON.stringify(isAvailableMessage)}
====
`;

		if (missingInformation.length > 0 || brokenRules.length > 0 || !isAvailable) {
			handleResponseSuccess(ctx, responseBody);
			return;
		}

		const reservationDetails = await Reservation.create(input);
		await addReservationToDate({
			date,
			time,
			reservation: reservationDetails._id.toString(),
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: `Reservationen har bokats med bokningsnummer: ${reservationDetails._id}
				${
					numberOfGuests > 12
						? `Säg till gästen att välja en av våra sällskapsmenyer samt tillhandahållt information om specialkost och andra önskemål.
Hela sällskapet måste ha gjort ett enat val av sällskapsmeny senast 5 dagar innan ankomst.
Gästen ska gå in på denna länk för att välja meny: https://setmenuform.berget.industries/${reservationDetails._id}`
						: ""
				}
				`,
			reservationData: {
				name,
				date,
				time,
				numberOfGuests,
				_id: reservationDetails._id,
			},
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
});

export default router;
