import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import updateContact from "./updateContact.ts";
import reservationRoutes from "./reservations/index.ts";
import addMessageHistory from "./addMessageHistory.ts";

const router = new Router();
const basePath = "/ai";
const routes = [updateContact, reservationRoutes, addMessageHistory];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
