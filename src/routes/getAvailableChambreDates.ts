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
			handleResponseSuccess(ctx, {
				status: "missing-information",
				message:
					"Start eller slutdatum finns inte eftersom följande information saknas: " +
					missingInformation.toString(),
			});
			return;
		}

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		const availableDates = (await getAvilableDates({ startDate, endDate })).map(
			({ date, lunch, dinner }) => ({
				date,
				lunch: lunch.isAvailable,
				dinner: dinner.isAvailable,
			})
		);
		const message =
			availableDates.length > 0 ? "Här är lediga tider för chambre." : "Det är fullbokat.";

		handleResponseSuccess(ctx, {
			status: "success",
			message,
			availableDates,
		});
	} catch (error) {
		console.error(error);
		handleResponseSuccess(ctx, {
			status: "could-not-get-dates",
			message: "Något gick fel, kunde inte hitta lediga tider i chambre.",
		});
	}
}

router.post("/getAvailableChambreDates", getAvailableChambreDates);

export default router;
