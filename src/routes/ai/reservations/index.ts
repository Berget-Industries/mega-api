import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import editReservation from "./editReservation.ts";
import createReservation from "./createReservation.ts";
import deleteReservation from "./deleteReservation.ts";
import getAvilableChambreDates from "./getAvailableChambreDates.ts";
import getReservationData from "./getReservationData.ts";

const router = new Router();
const basePath = "/reservation";
const routes = [
	createReservation,
	editReservation,
	deleteReservation,
	getAvilableChambreDates,
	getReservationData,
];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
