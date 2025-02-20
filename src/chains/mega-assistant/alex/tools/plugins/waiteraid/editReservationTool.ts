import { CallbackManagerForToolRun } from "npm:langchain/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain/tools";
import { z } from "npm:zod";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import Reservation from "../../../../../../models/Reservation.ts";
import convertToUTC from "../../../../../../utils/convertToUTC.ts";
import {
	checkChambreBookingRules,
	checkNormalBookingRules,
} from "../../../../../../utils/checkBookingRules.ts";
import {
	checkAvailableDates,
	editReservationFromDate,
} from "../../../../../../utils/availableDates.ts";

export const editReservationToolInputZod = z.object({
	_id: z.string().describe("Bokningsnummer"),
	name: z.string().optional().describe("Gästens namn"),
	email: z.string().optional().describe("Gästens e-postadress"),
	phone: z.string().optional().describe("Gästens telefonnummer."),
	numberOfGuests: z.number().optional().describe("Sällskapets storlek"),
	time: z.string().optional().describe("Tiden för bokningen med detta format: (00:00)"),
	date: z
		.string()
		.optional()
		.describe("Datumet för bokningen")
		.transform((dateString, ctx) => {
			if (!dateString) return null;
			const date = new Date(dateString);
			if (!z.date().safeParse(date).success) {
				ctx.addIssue({
					code: z.ZodIssueCode.invalid_date,
				});
			}
			return dateString;
		}),
	comment: z
		.string()
		.optional()
		.describe(
			"Kommentar till personalen på plats om tex önskemål eller annan okatigoriserad information om bokningen."
		),
});

const runFunction = async (
	input: z.infer<typeof editReservationToolInputZod>,
	_runManager: CallbackManagerForToolRun | undefined,
	conversationId: string
) => {
	try {
		const updateData: Record<string, any> = {};
		for (const [key, value] of Object.entries(input)) {
			if (key !== "_id" && value !== null && value !== "") {
				updateData[key] = value;
			}
		}

		if (updateData.date && updateData.time) {
			const { date, time } = updateData;
			updateData.date = convertToUTC(new Date(date), time);

			const isAvailable = await checkAvailableDates({
				date: new Date(date),
				time,
			});

			if (!isAvailable) {
				return Promise.resolve("Det valda datumet och tiden är inte tillgängliga.");
			}
		}

		const reservation = await Reservation.findById(input._id);

		if (!reservation) {
			return Promise.resolve(`Kunde inte hitta reservation med id: ${input._id}`);
		}

		const chambre = reservation?.chambre;
		const brokenRules = chambre
			? checkChambreBookingRules({ ...updateData, time: input.time })
			: checkNormalBookingRules({ ...updateData, time: input.time });

		if (brokenRules.length > 0) {
			return Promise.resolve(`Regelbrott: ${brokenRules.map((r) => r.message).join(", ")}`);
		}

		const reservationDetails = await Reservation.findOneAndUpdate(
			{ _id: input._id },
			{
				$set: updateData,
				$addToSet: { conversations: conversationId },
			},
			{ new: true }
		);

		if (reservationDetails?.chambre) {
			editReservationFromDate({
				reservation: reservationDetails._id.toString(),
				date: new Date(reservationDetails.date),
				time: input.time as string,
			});
		}

		return Promise.resolve(`Det lyckades! Dokument Id: ${reservationDetails?._id}`);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Tekniskt fel! Kunde inte uppdatera reservation!");
	}
};

export default function editReservationTool({
	tags,
	conversationId,
}: {
	tags: string[];
	conversationId: string;
}): StructuredTool {
	return new DynamicStructuredTool({
		verbose: false,
		schema: editReservationToolInputZod,
		name: "redigera-reservation",
		description: `användbart när du vill uppdatera information i en vanlig bordsbokning eller en reservation i chambre (La Cucina).
  `,
		func: (input, _runManager) => runFunction(input, _runManager, conversationId),
		callbacks: [new LoggerCallbackHandler()],
		tags,
	});
}
