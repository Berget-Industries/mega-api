import auth from "./auth/index.ts";
import admin from "./admin/index.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import getMessages from "./getMessages.ts";
import reservations from "./ai/reservations/index.ts";
import updateContact from "./ai/updateContact.ts";
import getConverstaion from "./getConversation.ts";
import addSelectedMenu from "./addSelectedMenu.ts";
import getConversations from "./getConversations.ts";
import addMessageHistory from "./addMessageHistory.ts";
import getReservationData from "./ai/getReservationData.ts";
import getAvailableChambreDates from "./ai/getAvailableChambreDates.ts";

const router = new Router();
const routes = [
	reservations,
	addMessageHistory,
	addSelectedMenu,
	auth,
	admin,
	getAvailableChambreDates,
	getConversations,
	getConverstaion,
	getMessages,
	getReservationData,
	updateContact,
];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
