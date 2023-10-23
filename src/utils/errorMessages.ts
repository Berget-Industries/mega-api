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

export const getCreateReservationSuccessMessage = (reservationData: object) => ({
	status: "success",
	message: "Reservationen har bokats!",
	reservationData,
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
