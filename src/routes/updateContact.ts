import mongoose from "mongoose";
import { Contact } from "../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";

const router = new Router();
router.post("/updateContact", async (ctx: Context) => {
	try {
		const {
			contact: { status, role, email, name, lastActivity, address, avatarUrl, phoneNumber },
		} = await ctx.request.body().value;
		let contact = await Contact.findOneAndUpdate(
			{ email },
			{
				$set: {
					status,
					role,
					email,
					name,
					lastActivity,
					address,
					avatarUrl,
					phoneNumber,
				},
			},
			{ new: true }
		);
		if (!contact) {
			contact = await Contact.create({
				status,
				role,
				email,
				name,
				lastActivity,
				address,
				avatarUrl,
				phoneNumber,
			});
		}
		console.log(contact.toObject());

		const body = "success";
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			const body = getInvalidIdErrorMessage();
			handleResponseError(ctx, body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		handleResponseError(ctx, body);
	}
});

export default router;
