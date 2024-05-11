import { z } from "npm:zod";
import { CallbackManagerForToolRun } from "npm:langchain@latest/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@latest/tools";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import createCalendarEvent from "../../../../../../utils/addGCalendarEvent.ts";
import getPluginConfig from "../../../../../../utils/getPluginConfig.ts";

export const createEventInputZod = z.object({
	eventNamn: z.string().describe("Namnet på eventet."),
	startDatum: z.string().describe("Startdatum och tid för eventet, i ISO-format."),
	slutDatum: z.string().describe("Slutdatum och tid för eventet, i ISO-format."),
	description: z.string().describe("En kort beskrivning av eventet."),
});

interface config {
	serviceAccountEmail: string;
	privateKey: string;
	calendarId: string;
}

const runFunction = async ({
	input,
	_runManager,
	conversationId,
	organizationId,
	config,
}: {
	input: z.infer<typeof createEventInputZod>;
	_runManager: CallbackManagerForToolRun | undefined;
	conversationId: string;
	organizationId: string;
	config: config; // Lämplig konfigurationstyp kan specificeras här.
}) => {
	try {
		console.log({
			input,
			conversationId,
			organizationId,
			config,
		});

		const { eventNamn, startDatum, slutDatum, description } = input;

		// Här antar vi att createCalendarEvent är en funktion som tar nödvändiga parametrar för att skapa ett kalenderevent
		const response = await createCalendarEvent({
			serviceAccountEmail: config.serviceAccountEmail,
			privateKey: config.privateKey,
			calendarId: config.calendarId,
			eventStart: startDatum,
			eventEnd: slutDatum,
			summary: eventNamn,
			description,
		}); // Anta att vi behöver organizationId för att skapa eventet i rätt kontext

		console.log(response);

		return Promise.resolve(response);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Kunde inte skapa kalenderhändelse! Försök igen senare.");
	}
};

export const createCalendarEventTool = ({
	tags,
	conversationId,
	organizationId,
	config,
}: {
	tags: string[];
	conversationId: string;
	organizationId: string;
	config: config; // Lämplig konfigurationstyp kan specificeras här.
}): StructuredTool =>
	new DynamicStructuredTool({
		verbose: false,
		schema: createEventInputZod,
		name: "skapa-kalenderhandelse",
		description: `Skapa en kalenderhändelse.
Bra att använda när du behöver lägga till ett event i kalendern.
Detta verktyg låter dig specificera eventnamn, start- och slutdatum samt en beskrivning.`,
		func: (input, _runManager) =>
			runFunction({ input, _runManager, conversationId, organizationId, config }),
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});

export default createCalendarEventTool;
