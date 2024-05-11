import { z } from "npm:zod";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import { getAvilableDates } from "../../../../../../utils/availableDates.ts";
import { CallbackManagerForToolRun } from "npm:langchain@latest/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@latest/tools";

export const getAvailableChambreDatesToolInput = z.object({
	startDate: z.string().describe("Första datumet i listan."),
	endDate: z.string().describe("Sista datumet i listan."),
});

const runFunction = async (
	input: z.infer<typeof getAvailableChambreDatesToolInput>,
	_runManager: CallbackManagerForToolRun | undefined
) => {
	try {
		const missingInformation = Object.entries({
			startDate: input.startDate,
			endDate: input.endDate,
		})
			.filter(([k, v]) => v == null || v === "")
			.map(([k, v]) => k);
		if (missingInformation.length > 0) {
			return Promise.resolve(
				"Start eller slutdatum finns inte eftersom följande information saknas: " +
					missingInformation.toString()
			);
		}

		const availableDates = (
			await getAvilableDates({
				startDate: new Date(input.startDate),
				endDate: new Date(input.endDate),
			})
		).map(
			({ date, lunch, dinner }) => `        
Datum: ${date}
Lunch: ${lunch.isAvailable}
Dinner ${dinner.isAvailable}
`
		);

		return Promise.resolve(
			availableDates.length > 0
				? "Här är lediga tider för chambre.\n" + availableDates.join("\n")
				: "Det är fullbokat."
		);
	} catch (error) {
		console.log(error);
		return Promise.resolve("Tekniskt fel. Kunde inte hämta reservation.");
	}
};

export const getAvailableChambreDatesTool = ({ tags }: { tags: string[] }): StructuredTool =>
	new DynamicStructuredTool({
		verbose: false,
		schema: getAvailableChambreDatesToolInput,
		name: "get-available-chambre-dates",
		description: `användbart när du behöver kolla upp vilka tider som är lediga i chambre mellan två datum. glöm inte att kolla dages datum. det är superviktigt att året blir rätt. Input ska vara ett start datum och ett slut datum. Resultatet innehåller en lista med alla bokningstillfällen från och med start datum till slut datum. Detta verktyg kan bara kolla upp lediga tider för chambre INTE vanliga bordbokningar.`,
		func: runFunction,
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});

export default getAvailableChambreDatesTool;
