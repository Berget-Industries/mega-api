import auth from "./auth/index.ts";
import admin from "./admin/index.ts";
import aiFunctions from "./ai/index.ts";
import getMessages from "./dashboard/getMessages.ts";
import getConverstaion from "./dashboard/getConversation.ts";
import addSelectedMenu from "./dashboard/addSelectedMenu.ts";
import getConversations from "./dashboard/getConversations.ts";

import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const routes = [
	auth,
	admin,
	aiFunctions,
	addSelectedMenu,
	getConversations,
	getConverstaion,
	getMessages,
];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
