import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@^0.0.159/tools";
import { z } from "zod";
import CallbackHandler from "../../../../../callbackHandler.ts";
import { Reservation, Contact } from "../../../../../../models/index.ts";
import convertToUTC from "../../../../../../utils/convertToUTC.ts";
import {
	checkChambreBookingRules,
	checkNormalBookingRules,
} from "../../../../../../utils/checkBookingRules.ts";
import {
	checkAvailableDates,
	addReservationToDate,
} from "../../../../../../utils/availableDates.ts";

export const createReservationToolInputZod = z.object({
	chambre: z.boolean().describe("Chambre eller inte"),
	name: z.string().describe("Namn"),
	email: z.string().describe("E-post"),
	phoneNumber: z.string().describe("Telefonnummer"),
	date: z.date().describe("Datum"),
	time: z.string().describe("Tid"),
	numberOfGuests: z.number().describe("Antalet gäster"),
	comment: z.string().describe("Kommentar"),
});

const runFunction = async (
	input: z.infer<typeof createReservationToolInputZod>,
	_runManager: CallbackManagerForToolRun | undefined,
	conversationId: string
) => {
	try {
		let contactDoc = await Contact.findOne({ email: input.email });
		if (!contactDoc) {
			contactDoc = await Contact.create({
				email: input.email,
				name: input.name,
				phoneNumber: input.phoneNumber,
			});
		}

		const reservationInput = {
			chambre: input.chambre,
			name: input.name,
			email: input.email,
			phone: input.phoneNumber,
			date: convertToUTC(input.date, input.time),
			numberOfGuests: input.numberOfGuests,
			comment: input.comment,
			menu: undefined,
			conversations: [conversationId],
		};

		const missingInformation = Object.entries(reservationInput)
			.filter(([_, v]) => v == null || v === "")
			.map(([k, _]) => k);
		if (missingInformation.length > 0) {
			return Promise.resolve(`Saknad information: ${missingInformation.join(", ")}`);
		}

		const brokenRules = input.chambre
			? checkChambreBookingRules(reservationInput)
			: checkNormalBookingRules(reservationInput);
		if (brokenRules.length > 0) {
			return Promise.resolve(`Bruten regel: ${brokenRules.map((r) => r.message).join(", ")}`);
		}

		const isAvailable = await checkAvailableDates({ date: input.date, time: input.time });
		if (!isAvailable) {
			return Promise.resolve("Det valda datumet och tiden är inte tillgängliga.");
		}

		const reservationDetails = await Reservation.create(reservationInput);
		await addReservationToDate({
			date: input.date,
			time: input.time,
			reservation: reservationDetails._id.toString(),
		});

		return Promise.resolve(`Det lyckades! Ändrat dokument: ${reservationDetails._id}`);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Tekniskt fel. Kunde inte skapa reservation.");
	}
};

export const createReservationTool = ({ tags }: { tags: string[] }): StructuredTool =>
	new DynamicStructuredTool({
		verbose: false,
		schema: createReservationToolInputZod,
		name: "skapa-reservation",
		description: `användbart när du vill skapa en ny reservaion. Här kan du göra både vanliga bordbokingar och bokningar för chambre (La Cucina)
Om du inte har fått tillräckligt med information från gästen för att fylla i alla inputs till den här funktionen måste du sätta värdet till den input till null.
Innan du kan använda det här vekrtyget måste du ta reda på följande information av gästen: namn, email, phone, date, time, numberOfGuests
Om gäste inte säger något om antal gäster måste du fråga gästen. Du får inte anta att gästen vill boka för en person.
Tänk på att du alltid måste kolla upp datumet just nu med verktyget (get-current-date-and-time) för att förstå vilket år gästen menar, bokningen som skapas måste alltid vara i framtiden.
  `,
		func: runFunction,
		tags,
		callbacks: [new CallbackHandler()],
	});

export default createReservationTool;
