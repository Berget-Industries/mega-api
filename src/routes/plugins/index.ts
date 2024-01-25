import getConfig from "./getConfig.ts";
import addSelectedMenu from "./addSelectedMenu.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const basePath = "/plugins";
const routes = [getConfig, addSelectedMenu];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
