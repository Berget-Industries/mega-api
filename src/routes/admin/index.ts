import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import createNewUser from "./createNewUser.ts";
import createNewOrganization from "./createNewOrganization.ts";
import apiKey from "./apikey/index.ts";
import plugin from "./plugin/index.ts";

const router = new Router();
const basePath = "/admin";
const routes = [createNewUser, createNewOrganization, apiKey, plugin];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
