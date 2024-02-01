import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import user from "./user/index.ts";
import createNewOrganization from "./createNewOrganization.ts";
import createNewApiKey from "./createNewApiKey.ts";
import plugin from "./plugin/index.ts";

const router = new Router();
const basePath = "/admin";
const routes = [user, createNewOrganization, createNewApiKey, plugin];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
