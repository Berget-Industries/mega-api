import { BrokenRule } from "./checkBookingRules.ts";

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
	message: Object.entries(brokenRules)
		.map(([key, message]) => `Broken rule for value of ${key}: ${message}`)
		.join("\n"),
});

export const getCreateReservationSuccessMessage = ({ name, date, time, numberOfGuests }: any) => ({
	status: "success",
	message: "Reservationen har bokats!",
	nextStep:
		numberOfGuests > 12
			? "Säg till gästen att välja en av våra sällskapsmenyer. Säg att du har bifogat menyerna i mailet. Hela sällskapet måste ha gjort ett enat val av sällskapsmeny senast 5 dagar innan ankomst. Fråga även efter specialkost och andra önskemål."
			: "",
	reservationData: {
		name,
		date,
		time,
		numberOfGuests,
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
