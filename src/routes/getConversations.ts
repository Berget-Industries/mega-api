import mongoose from "npm:mongoose";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Organization } from "../models/index.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();
router.get("/conversations", async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;
		const endDate = params.get("endDate");
		const startDate = params.get("startDate");
		const organization = ctx.state.organization;

		if (!organization) {
			handleResponseError(ctx, {
				status: "missing-id",
				message: "Saknar reservations id:et.",
			});
			return;
		}

		const organizationDoc = await Organization.findById(organization)
			.populate({
				path: "conversations",
				populate: [{ path: "messages" }, { path: "contact" }],
			})
			.exec();

		const conversations = organizationDoc ? organizationDoc.conversations : [];
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hitta konversationerna.",
			conversations,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta konversationen. ID:et är ogiltigt.",
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
