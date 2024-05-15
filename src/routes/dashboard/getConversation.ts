import mongoose from "npm:mongoose";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { Conversation, Organization, Reservation } from "../../models/index.ts";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import checkOrganizationAccess from "../../middleware/checkOrganizationAccess.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";

const router = new Router();
router.get(
	"/conversation",
	authenticationMiddleware,
	checkOrganizationAccess,
	async (ctx: Context) => {
		try {
			const conversation = ctx.request.url.searchParams.get("conversation");
			if (!conversation) {
				handleResponseError(ctx, {
					status: "missing-id",
					message: "Saknar reservations id:et.",
				});
				return;
			}
			const conversationDoc = await Conversation.findById(conversation)
				.populate("messages contact")
				.exec();

			const body = { conversation: conversationDoc };
			handleResponseSuccess(ctx, body);
		} catch (error) {
			console.error(error);
			if (error instanceof mongoose.Error.CastError) {
				handleResponseError(ctx, {
					status: "invalid-id",
					message: "Kunde inte hitta reservationen. ID:et är ogiltigt.",
				});
				return;
			}
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Tekniskt fel.",
			});
		}
	}
);

router.get("/conversation/chat", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const conversationId = ctx.request.url.searchParams.get("conversation");
		if (!conversationId) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}

		const organizationId = ctx.state.organizationId;

		const conversationDoc = await Conversation.findOne({
			_id: conversationId,
			organization: organizationId,
		})
			.populate("messages contact")
			.exec();

		if (!conversationDoc) {
			handleResponseError(ctx, {
				status: "not-found",
				message: "Ingen konversation hittades med angivet ID för denna organisation.",
			});
			return;
		}

		handleResponseSuccess(ctx, { conversation: conversationDoc });
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta konversationen. ID:et är ogiltigt.",
			});
		} else {
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Tekniskt fel.",
			});
		}
	}
});

export default router;
