import { z } from "zod";
import CallbackHandler from "../../../../../callbackHandler.ts";
import { Reservation } from "../../../../../../models/index.ts";
import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";
import { deleteReservationFromDate } from "../../../../../../utils/availableDates.ts";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@^0.0.159/tools";

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

		return Promise.resolve(
			reservationDetails
				? "Reservationen är borttagen!"
				: "Kunde inte hitta reservation med det angivna id:t!"
		);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Tekniskt fel! Kunde inte ta bort reservation!");
	}
};

export function deleteReservationTool({ tags }: { tags: string[] }): StructuredTool {
	return new DynamicStructuredTool({
		verbose: false,
		schema: deleteReservationToolInputZod,
		name: "avboka-reservation",
		description:
			"användbart när du vill avboka en vanlig bordsbokning eller reservaion i chambre (La Cucina)",
		func: runFunction,
		callbacks: [new CallbackHandler()],
		tags,
	});
}
