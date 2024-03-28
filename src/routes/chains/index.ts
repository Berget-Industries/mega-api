import mailSubjector from "./mailSubjector.ts";
import megaAssistant from "./megaAssistant.ts";
import chainStarter from "./chainStarter.ts";
import autoFilter from "./autoFilter.ts";
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();
const basePath = "/chains";
const routes = [mailSubjector, megaAssistant, chainStarter, autoFilter];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
