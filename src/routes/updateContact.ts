import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Contact } from "../models/index.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";

import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";

const router = new Router();

async function updateContact(ctx: Context) {
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

		ctx.response.status = 200;
		ctx.response.body = "success";
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			console.error(error);
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post(
	"/updateContact",
	//authenticationMiddleware,
	updateContact
);

export default router;
