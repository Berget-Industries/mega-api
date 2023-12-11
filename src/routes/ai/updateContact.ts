import mongoose from "npm:mongoose";
import { Contact } from "../../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import aiAuthenticationMiddleware from "../../middleware/aiAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/updateContact", aiAuthenticationMiddleware, async (ctx: Context) => {
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
		handleResponseSuccess(ctx, "success");
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseSuccess(ctx, {
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
});

export default router;
