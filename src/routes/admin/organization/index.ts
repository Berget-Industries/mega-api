import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import exportRoute from "./export.ts";
import importRoute from "./import.ts";
import create from "./create.ts";
import list from "./list.ts";
import deactivatePlugins from "./deactivatePlugins.ts";

const router = new Router();
const basePath = "/organization";
const routes = [create, exportRoute, importRoute, list, deactivatePlugins];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
