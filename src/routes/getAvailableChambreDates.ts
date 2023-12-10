import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
	getMissingInformationErrorMessage,
	getAvailableChambreDatesSuccessMessage,
	getAvailableChambreDatesErrorMessage,
} from "../utils/errorMessages.ts";
import { getAvilableDates } from "../utils/availableDates.ts";
import aiAuthenticationMiddleware from "../middleware/aiAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";

const router = new Router();
async function getAvailableChambreDates(ctx: Context) {
	try {
		let { startDate, endDate } = await ctx.request.body().value;

		const missingInformation = Object.entries({
			startDate,
			endDate,
		})
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);

		if (missingInformation.length > 0) {
			const body = getMissingInformationErrorMessage(missingInformation.toString());
			handleResponseSuccess(ctx, body);
			return;
		}

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		const availableDates = await getAvilableDates({ startDate, endDate });

		const body = getAvailableChambreDatesSuccessMessage(availableDates);
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		const body = getAvailableChambreDatesErrorMessage(error);
		handleResponseError(ctx, body);
	}
}

router.post("/getAvailableChambreDates", aiAuthenticationMiddleware, getAvailableChambreDates);

export default router;
