import reservations from "./reservations/index.ts";
import addMessageHistory from "./addMessageHistory.ts";
import addSelectedMenu from "./addSelectedMenu.ts";
import auth from "./auth/index.ts";
import admin from "./admin/index.ts";
import getAvailableChambreDates from "./getAvailableChambreDates.ts";
import getConverstaion from "./getConversation.ts";
import getConversations from "./getConversations.ts";
import getMessages from "./getMessages.ts";
import getReservationData from "./getReservationData.ts";
import updateContact from "./updateContact.ts";

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

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
