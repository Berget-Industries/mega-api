import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import editReservation from "./editReservation.ts";
import createReservation from "./createReservation.ts";
import deleteReservation from "./deleteReservation.ts";

const router = new Router();
const routes = [createReservation, editReservation, deleteReservation];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
