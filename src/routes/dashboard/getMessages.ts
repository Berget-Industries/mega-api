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

		const endDateParam = params.get("endDate");
		const startDateParam = params.get("startDate");
		const organization = ctx.state.organization;

		if (!organization) throw "missing-id";
		if (!endDateParam) throw "missing-endDate;";
		if (!startDateParam) throw "missing-startDate";

		const endDate = new Date(decodeURIComponent(endDateParam));
		const startDate = new Date(decodeURIComponent(startDateParam));

		const messages = await Message.find({
			organization,
			createdAt: {
				$gte: startDate,
				$lte: endDate,
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
