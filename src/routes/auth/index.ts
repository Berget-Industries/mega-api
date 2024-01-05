import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import resetPasswordWithToken from "./resetPasswordWithToken.ts";
import login from "./login.ts";
import logout from "./logout.ts";
import me from "./me.ts";
import resetPasswoord from "./resetPassword.ts";

const router = new Router();
const basePath = "/auth";
const routes = [resetPasswordWithToken, login, logout, me, resetPasswoord];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
