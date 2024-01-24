import addSelectedMenu from "./addSelectedMenu.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const routes = [addSelectedMenu];

routes.forEach((_) => {
	router.use(_.routes());
	router.use(_.allowedMethods());
});

export default router;
