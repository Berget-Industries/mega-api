export const missingIdErrMsg = {
	status: "missing-id",
	message: "Saknar reservations id:et.",
};

export const missingInfoErrMsg = {
	status: "missing-information",
	message: "Det gick inte att skapa reservationen. Följande information saknas: ",
};

export const invalidIDErrMsg = {
	status: "invalid-information",
	message: "Kunde inte hitta reservationen. ID:et är ogiltigt",
};

export const notAvailableErrMsg = {
	status: "not-available",
	message:
		"Reservationen kunde inte skapas eftersom datumet eller tiden kunden angav är upptagen",
};

export const createResSuccessMsg = {
	status: "success",
	message: "Reservationen har bokats!",
	reservationDetails: {},
};

export const editResSuccessMsg = {
	status: "success",
	message: "Reservationen har uppdaterats!",
	reservationDetails: {},
};

export const deleteResSuccessMsg = {
	status: "success",
	message: "Reservationen har tagits bort!",
	reservationDetails: {},
};

export const getDataSuccessMsg = {
	status: "success",
	message: "Reservation har hämtats!",
	reservationData: {},
};
