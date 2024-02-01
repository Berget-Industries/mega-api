import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import create from "./create.ts";

const router = new Router();
const basePath = "/organization";
const routes = [create];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
