import reservations from "./reservations/index.ts";
import addMessageHistory from "./addMessageHistory.ts";
import addSelectedMenu from "./addSelectedMenu.ts";
import auth from "./auth.ts";
import getAvailableChambreDates from "./getAvailableChambreDates.ts";
import getConverstaion from "./getConversation.ts";
import getConversations from "./getConversations.ts";
import getMessages from "./getMessages.ts";
import getReservationData from "./getReservationData.ts";
import updateContact from "./updateContact.ts";

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();

router.use(reservations.routes());
router.use(reservations.allowedMethods());

router.use(addMessageHistory.routes());
router.use(addMessageHistory.allowedMethods());

router.use(addSelectedMenu.routes());
router.use(addSelectedMenu.allowedMethods());

router.use(auth.routes());
router.use(auth.allowedMethods());

router.use(getAvailableChambreDates.routes());
router.use(getAvailableChambreDates.allowedMethods());

router.use(getConversations.routes());
router.use(getConversations.allowedMethods());

router.use(getConverstaion.routes());
router.use(getConverstaion.allowedMethods());

router.use(getMessages.routes());
router.use(getMessages.allowedMethods());

router.use(getReservationData.routes());
router.use(getReservationData.allowedMethods());

router.use(updateContact.routes());
router.use(updateContact.allowedMethods());

export default router;
