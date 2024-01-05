import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import changePassword from "./changePassword.ts";
import login from "./login.ts";
import logout from "./logout.ts";
import me from "./me.ts";
import requestResetPasswordToken from "./requestResetPasswordToken.ts";

const router = new Router();
const basePath = "/auth";
const routes = [changePassword, login, logout, me, requestResetPasswordToken];

routes.forEach((_) => {
	router.use(basePath, _.routes());
	router.use(basePath, _.allowedMethods());
});

export default router;
