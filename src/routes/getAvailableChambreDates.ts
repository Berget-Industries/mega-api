import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
	getMissingInformationErrorMessage,
	getAvailableChambreDatesSuccessMessage,
	getAvailableChambreDatesErrorMessage,
} from "../utils/errorMessages.ts";
import { getAvilableDates } from "../utils/availableDates.ts";

const router = new Router();
async function getAvailableChambreDates(ctx: Context) {
	try {
		const { date } = await ctx.request.body().value;

		const missingInformation = Object.entries({
			date,
		})
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);

		if (missingInformation.length > 0) {
			const body = getMissingInformationErrorMessage(missingInformation.toString());
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}

		const availableDates = await getAvilableDates({ date });

		const body = getAvailableChambreDatesSuccessMessage(availableDates);
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		const body = getAvailableChambreDatesErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.post("/getAvailableChambreDates", getAvailableChambreDates);

export default router;
