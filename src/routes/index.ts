import auth from "./auth/index.ts";
import admin from "./admin/index.ts";
import ping from "./ping.ts";
import chains from "./chains/index.ts";
import aiFunctions from "./ai/index.ts";
import addSelectedMenu from "./addSelectedMenu.ts";
import dashboard from "./dashboard/index.ts";
import updateContact from "./updateContact.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const routes = [auth, admin, aiFunctions, dashboard, addSelectedMenu, ping, updateContact, chains];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
