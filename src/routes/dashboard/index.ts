import getMessages from "./getMessages.ts";
import getPluginStats from "./getPluginStats.ts";
import getConverstaion from "./getConversation.ts";
import getConversations from "./getConversations.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const basePath = "/dashboard";
const routes = [getConversations, getPluginStats, getConverstaion, getMessages];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
