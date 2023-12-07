import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation, Organization } from "../models/index.ts";
import {
	getMissingIdErrorMessage,
	getReservationDataErrorMessage,
	getInvalidIdErrorMessage,
	getReservationDataSuccessMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";

import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();

router.get("/organization/conversations", async (ctx: Context) => {
	try {
		const params = ctx.request.url.searchParams;

		const endDate = params.get("endDate");
		const startDate = params.get("startDate");
		const organizationId = params.get("organizationId");

		if (!organizationId) {
			const body = getMissingIdErrorMessage();
			handleResponseSuccess(ctx, body);
			return;
		}

		const organization = await Organization.findById(organizationId)
			.populate({
				path: "conversations",
				populate: [{ path: "messages" }, { path: "contactId" }],
			})
			.exec();

		const conversations = organization ? organization.conversations : [];

		const body = { conversations };
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}

		const body = getReservationDataErrorMessage(error);
		handleResponseError(ctx, body);
	}
});

export default router;
