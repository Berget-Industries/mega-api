import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import add from "./add.ts";

const router = new Router();
const basePath = "/plugin";
const routes = [add];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
