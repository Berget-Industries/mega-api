import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getAvilableDates } from "../utils/availableDates.ts";
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
			handleResponseError(ctx, {
				status: "missing-information",
				message:
					"Det gick inte att skapa reservationen. Följande information saknas: " +
					missingInformation.toString(),
			});
			return;
		}

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		const availableDates = await getAvilableDates({ startDate, endDate });
		handleResponseSuccess(ctx, {
			status: "success",
			message:
				availableDates.length > 0
					? "Här är lediga tider för chambre."
					: "Det är fullbokat.",
			availableDates: availableDates.map(({ date, lunch, dinner }) => ({
				date,
				lunch: lunch.isAvailable,
				dinner: dinner.isAvailable,
			})),
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "could-not-get-dates",
			message: "Något gick fel, kunde inte hitta lediga tider i chambre.",
		});
	}
}

router.post("/getAvailableChambreDates", getAvailableChambreDates);

export default router;
