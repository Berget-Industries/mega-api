import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import user from "./user/index.ts";
import apiKey from "./apikey/index.ts";
import plugin from "./plugin/index.ts";
import organization from "./organization/index.ts";

const router = new Router();
const basePath = "/admin";
const routes = [user, apiKey, plugin, organization];


routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
