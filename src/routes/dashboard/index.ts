import getMessages from "./getMessages.ts";
import getConverstaion from "./getConversation.ts";
import getConversations from "./getConversations.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import checkOrganizationAccess from "../../middleware/checkOrganizationAccess.ts";

const router = new Router();
const basePath = "/dashboard";
const routes = [getConversations, getConverstaion, getMessages];

routes.forEach((_) => {
	router.use(basePath, checkOrganizationAccess, _.routes());
	router.use(basePath, checkOrganizationAccess, _.allowedMethods());
});

export default router;
