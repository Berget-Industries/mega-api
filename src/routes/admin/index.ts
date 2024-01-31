import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import createNewUser from "./createNewUser.ts";
import organization from "./organization/index.ts";
import createNewApiKey from "./createNewApiKey.ts";
import plugin from "./plugin/index.ts";

const router = new Router();
const basePath = "/admin";
const routes = [createNewUser, organization, createNewApiKey, plugin];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
