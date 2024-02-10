import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getAvailablePlugins } from "../../../utils/getAvailablePlugins.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

const router = new Router();
router.get(
	"/get-available-plugins",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	(ctx: Context) => {
		try {
			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa ett nytt plugin.",
				availablePlugins: getAvailablePlugins(),
			});
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Ett internt fel har uppstått.",
			});
		}
	}
);

export default router;
