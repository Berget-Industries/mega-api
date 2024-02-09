import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import list from "./list.ts";
import remove from "./remove.ts";
import create from "./create.ts";
import addOrganization from "./addOrganization.ts";
import removeOrganization from "./removeOrganization.ts";

const router = new Router();
const basePath = "/user";
const routes = [create, remove, list, addOrganization, removeOrganization];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
