import { BrokenRule } from "./checkBookingRules.ts";
import { IAvailableDateDetails } from "../models/AvailableDatesModel.ts";

export const getMissingIdErrorMessage = () => ({
	status: "missing-id",
	message: "Saknar reservations id:et.",
});
export const getMissingInformationErrorMessage = (missingInformation: string) => ({
	status: "missing-information",
	message:
		"Det gick inte att skapa reservationen. Följande information saknas: " + missingInformation,
});
export const getInvalidIdErrorMessage = () => ({
	status: "invalid-id",
	message: "Kunde inte hitta reservationen. ID:et är ogiltigt",
});

export const getNotAvailableErrorMessage = () => ({
	status: "not-available",
	message: "Tiden är inte ledig!",
});

export const getBrokenRulesErrorMessage = (brokenRules: BrokenRule[]) => ({
	status: "booking-rules-not-followed",
	message: brokenRules
		.map(({ inputKey, message }) => `Broken rule for value of ${inputKey}: ${message}`)
		.join("\n"),
});

export const getCreateReservationSuccessMessage = ({
	name,
	date,
	time,
	numberOfGuests,
	_id,
}: any) => ({
	status: "success",
	message: "Reservationen har bokats med bokningsnummer: " + _id,
	nextStep:
		numberOfGuests > 12
			? `
Säg till gästen att välja en av våra sällskapsmenyer samt hillhandahållt information om specialkost och andra önskemål.
Hela sällskapet måste ha gjort ett enat val av sällskapsmeny senast 5 dagar innan ankomst. 
Gästen ska gå in på denna länk för att välja meny: http://localhost:3000/${_id}
`
			: "",
	reservationData: {
		name,
		date,
		time,
		numberOfGuests,
		_id,
	},
});
export const getCreateReservationErrorMessage = (error: any) => ({
	status: "internal-error",
	message: "Kunde inte skapa reservation",
});

export const getEditReservationSuccessMessage = (reservationData: any) => ({
	status: "success",
	message: "Reservationen har uppdaterats!",
	reservationData,
});

export const getEditReservationErrorMessage = (error: any) => ({
	status: "internal-error",
	message: "Kunde inte uppdatera reservation!",
});

export const getEditReservationNoChangeMessage = () => ({
	status: "no-change",
	message: "Allt gick som det skulle men inget ändrades i reservationen!",
});

export const getDeleteReservationSuccessMessage = (reservationData: any) => ({
	status: "success",
	message: "Reservationen har tagits bort!",
	reservationData,
});
export const getDeleteReservationErrorMessage = () => ({
	status: "internal-error",
	message: "Kunde inte ta bort reservation.",
});

export const getReservationDataSuccessMessage = (reservationData: any) => ({
	status: "success",
	message: "Reservation har hämtats!",
	reservationData,
});

export const getReservationDataErrorMessage = (error: any) => ({
	status: "success",
	message: "Kunde inte hämta reservation!",
});

export const getAvailableChambreDatesErrorMessage = (error: any) => ({
	status: "could-not-get-dates",
	message: "Något gick fel kunde inte hitta lediga tider i chambre.",
});

export const getAvailableChambreDatesSuccessMessage = (
	availableDates: IAvailableDateDetails[]
) => ({
	status: "success",
	message: availableDates.length > 0 ? "Här är lediga tider för chambre!" : "Det är fullbokat!",
	availableDates: availableDates.map(({ date, lunch, dinner }) => ({
		date,
		lunch: lunch.isAvailable,
		dinner: dinner.isAvailable,
	})),
});
