import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Message, Organization } from "../models/index.ts";
import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";

import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

router.get("/getMessages", authenticationMiddleware, async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;
		const endDate = params.get("endDate");
		const startDate = params.get("startDate");
		const organizationId = params.get("organizationId");

		if (!organizationId) throw "missing-id";
		if (!startDate) throw "missing-startDate";
		if (!endDate) throw "missing-endDate;";

		const organization = await Organization.findById(organizationId)
			.populate({
				path: "messages",
				populate: "contactId",
				match: {
					createdAt: {
						$gte: decodeURIComponent(startDate),
						$lte: decodeURIComponent(endDate),
					},
				},
			})
			.exec();
		const messages = organization?.messages;
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Lyckades hitta meddelanden.",
			messages,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "invalid-id",
				message: "Kunde inte hitta meddelanden. ID:et är ogiltigt.",
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
