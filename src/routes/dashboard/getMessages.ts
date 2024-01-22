import mongoose from "npm:mongoose";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import checkOrganizationAccess from "../../middleware/checkOrganizationAccess.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Message, Organization } from "../../models/index.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();

router.get("/messages", authenticationMiddleware, checkOrganizationAccess, async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;

		const endDate = params.get("endDate");
		const startDate = params.get("startDate");
		const organization = ctx.state.organization;

		if (!organization) throw "missing-id";
		if (!startDate) throw "missing-startDate";
		if (!endDate) throw "missing-endDate;";

		const messages = await Message.find({
			match: {
				createdAt: {
					$gte: decodeURIComponent(startDate),
					$lte: decodeURIComponent(endDate),
				},
			},
		})
			.populate("contact")
			.exec();

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
