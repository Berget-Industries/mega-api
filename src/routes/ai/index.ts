import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import reservationRoutes from "./reservations/index.ts";
import addMessageHistory from "./addMessageHistory.ts";
import getAgentConfig from "./getAgentConfig.ts";

const router = new Router();
const basePath = "/ai";
const routes = [reservationRoutes, addMessageHistory, getAgentConfig];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
