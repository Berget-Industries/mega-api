import mongoose from "npm:mongoose";
import { Contact } from "../models/index.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import apiKeyAuthenticationMiddleware from "../middleware/apiKeyAuthenticationMiddleware.ts";

const router = new Router();
router.post("/updateContact", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { contact } = await ctx.request.body().value;
		const { name, email, phone, avatarUrl } = contact;
		let updatedContact = await Contact.findOneAndUpdate(
			{ email },
			{
				$set: {
					email,
					name,
					avatarUrl,
					phone,
				},
			},
			{ new: true }
		);
		if (!updatedContact) {
			updatedContact = await Contact.create({
				email,
				name,
				avatarUrl,
				phone,
			});
		}
		handleResponseSuccess(ctx, {
			status: "success",
			message: "Kontakten har skapats.",
			contact: updatedContact,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "could-not-find",
				message: "Kunde inte hitta kontakten.",
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
