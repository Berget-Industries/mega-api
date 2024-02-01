import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ApiKey } from "../../../models/index.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";

import { handleResponseSuccess, handleResponseError } from "../../../utils/contextHandler.ts";

const router = new Router();

router.get(
	"/list",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const apiKeys = await ApiKey.find();
			const apiKeyMap = apiKeys.map((apiKey) => apiKey.toObject());

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades hämta api nycklar.",
				apiKeys: apiKeyMap,
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
