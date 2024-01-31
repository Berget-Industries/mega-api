import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import create from "./create.ts";
import list from "./list.ts";

const router = new Router();
const basePath = "/user";
const routes = [create, list];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
