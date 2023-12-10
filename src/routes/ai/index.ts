import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import getAvailableChambreDates from "./getAvailableChambreDates.ts";
import getReservationData from "./getReservationData.ts";
import updateContact from "./updateContact.ts";

const router = new Router();
const routes = [getAvailableChambreDates, getReservationData, updateContact];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
