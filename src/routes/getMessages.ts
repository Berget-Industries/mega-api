import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Message, Organization } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";

const router = new Router();

router.get("/getMessages", authenticationMiddleware, async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;

		const endDate = params.get("endDate");
		const startDate = params.get("startDate");

		console.log(endDate, startDate);

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

		ctx.response.status = 200;
		ctx.response.body = { messages };
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 400;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
});

export default router;
