import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Organization } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";

const router = new Router();

router.get("/organization/conversations", async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;

		const endDate = params.get("endDate");
		const startDate = params.get("startDate");
		const organizationId = params.get("organizationId");

		if (!organizationId) {
			const body = getMissingIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const organization = await Organization.findById(organizationId)
			.populate({
				path: "conversations",
				populate: [{ path: "messages" }, { path: "contactId" }],
			})
			.exec();

		const conversations = organization ? organization.conversations : [];

		ctx.response.status = 200;
		ctx.response.body = { conversations };
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
