import mongoose from "npm:mongoose";
import { Plugin } from "../../../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../../middleware/apiKeyAuthenticationMiddleware.ts";

import {
	handleResponseError,
	handleResponsePartialContent,
	handleResponseSuccess,
	handleResponseUnauthorized,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.get("/config", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const organization = ctx.state.organizationId;
		const query: Record<string, any> = {
			name: "chat-client",
			isActivated: true,
			organization,
		};

		const params = ctx.request.url.searchParams;
		const chatClientId = params.get("id");
		if (chatClientId) {
			if (!mongoose.Types.ObjectId.isValid(chatClientId)) {
				return handleResponsePartialContent(ctx, {
					status: "invalid-id",
					message: "Config id invalid format",
				});
			}

			query._id = chatClientId;
		}

		const foundChatClient = await Plugin.findOne(query);
		if (!foundChatClient) {
			return handleResponseUnauthorized(ctx, {
				status: "unauthrorized",
				message: "Pluginet finns inte och eller är inte aktiverat",
			});
		}

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hämta plugin config!",
			configId: foundChatClient._id,
			config: foundChatClient.config,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta konfigurationen.",
			});
			return;
		}
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
});

export default router;
