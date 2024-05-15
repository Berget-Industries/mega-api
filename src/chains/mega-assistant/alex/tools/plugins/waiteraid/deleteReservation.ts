import { z } from "npm:zod";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import { Reservation } from "../../../../../../models/index.ts";
import { CallbackManagerForToolRun } from "npm:@langchain/core/callbacks/base";
import { deleteReservationFromDate } from "../../../../../../utils/availableDates.ts";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain/tools";

export const deleteReservationToolInputZod = z.object({
	_id: z.string().describe("Bokningsnummer"),
});

const runFunction = async (
	input: z.infer<typeof deleteReservationToolInputZod>,
	_runManager: CallbackManagerForToolRun | undefined
) => {
	try {
		const reservationDetails = await Reservation.findByIdAndDelete(input._id);

		await deleteReservationFromDate({
			reservation: input._id,
		});

		if (!reservationDetails) {
			return Promise.resolve("Kunde inte hitta reservation med det angivna id:et");
		} else {
			return Promise.resolve(`Det lyckades! Dokument Id: ${reservationDetails._id}`);
		}
	} catch (error) {
		console.error(error);
		return Promise.resolve("Tekniskt fel! Kunde inte ta bort reservation!");
	}
};

export default function deleteReservationTool({ tags }: { tags: string[] }): StructuredTool {
	return new DynamicStructuredTool({
		verbose: false,
		schema: deleteReservationToolInputZod,
		name: "avboka-reservation",
		description:
			"användbart när du vill avboka en vanlig bordsbokning eller reservaion i chambre (La Cucina)",
		func: runFunction,
		callbacks: [new LoggerCallbackHandler()],
		tags,
	});
}
