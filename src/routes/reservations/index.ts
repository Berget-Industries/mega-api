import createReservation from "./createReservation.ts";
import editReservation from "./editReservation.ts";
import deleteReservation from "./deleteReservation.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();

const routes = [createReservation, editReservation, deleteReservation];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
