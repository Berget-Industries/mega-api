import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import add from "./add.ts";
import list from "./list.ts";
import remove from "./remove.ts";
import activate from "./activate.ts";
import deactivate from "./deactivate.ts";

const router = new Router();
const basePath = "/plugin";
const routes = [add, list, remove, activate, deactivate];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
