import createReservation from "./createReservation.ts";
import editReservation from "./editReservation.ts";
import deleteReservation from "./deleteReservation.ts";

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();

router.use(createReservation.routes());
router.use(createReservation.allowedMethods());

router.use(editReservation.routes());
router.use(editReservation.allowedMethods());

router.use(deleteReservation.routes());
router.use(deleteReservation.allowedMethods());

export default router;
