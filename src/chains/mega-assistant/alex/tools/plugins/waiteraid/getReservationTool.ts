import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@^0.0.159/tools";
import { z } from "zod";
import { LoggerCallbackHandler } from "../../../callbackHandlers/index.ts";
import { Reservation } from "../../../../models/index.ts";

export const getReservationToolInputZod = z.object({
	_id: z.string().describe("Bokningsnummer"),
});

const runFunction = async (
	input: z.infer<typeof getReservationToolInputZod>,
	_runManager: CallbackManagerForToolRun | undefined
) => {
	try {
		if (!input._id) {
			return Promise.resolve("Saknar reservations id:et.");
		}

		const reservationDetails = await Reservation.findById(input._id);
		return Promise.resolve(`Reservation har hämtats. ${reservationDetails}`);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Tekniskt fel.");
	}
};

export default function getReservationTool({ tags }: { tags: string[] }): StructuredTool {
	return new DynamicStructuredTool({
		verbose: false,
		schema: getReservationToolInputZod,
		name: "get-reservation",
		description: `användbart när du behöver kolla upp en befintlig reservation.`,
		func: runFunction,
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});
}
