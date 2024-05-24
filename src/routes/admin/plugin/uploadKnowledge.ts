import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";

import {
	handleResponseError,
	handleResponsePartialContent,
	handleResponseSuccess,
} from "../../../utils/contextHandler.ts";

import uploadData from "../../../utils/uploadData.ts";

const router = new Router();
router.post(
	"/upload-knowledge",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { document, collection } = await ctx.request.body().value;
			if (
				!document ||
				typeof document !== "string" ||
				!collection ||
				typeof collection !== "string"
			) {
				return handleResponsePartialContent(ctx, {
					status: "missing-values",
					message: "Missing keys document or collection",
				});
			}

			await uploadData(document, collection);

			return handleResponseSuccess(ctx, {
				status: "success",
				message: "Document uploaded!",
			});
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Tekniskt fel.",
			});
		}
	}
);

export default router;
