import { z } from "npm:zod";
import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@^0.0.159/tools";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import { sendMail } from "../../../../../../utils/emailSender.ts";
import getPluginConfig from "../../../../../../utils/getPluginConfig.ts";

export const sendMailToHumanToolInputZod = z.object({
	namn: z.string().describe("Namnet på personen som du pratar med just."),
	email: z.string().email().describe("E-post till personen pratar med just nu."),
	description: z.string().describe("Beskriv vad personen är intresserad av"),
});

const runFunction = async ({
	input,
	_runManager,
	conversationId,
	organizationId,
	config,
}: {
	input: z.infer<typeof sendMailToHumanToolInputZod>;
	_runManager: CallbackManagerForToolRun | undefined;
	conversationId: string;
	organizationId: string;
	config: {
		subject: string;
		sendTo: string;
	};
}) => {
	try {
		const html = `
			<div>
				<h1>
					Meddelande från Alex din broder!
				</h1>
				<p>Jag har fått en intresseanmälan från en mailen. Här är informationen:</p>
				<ul>
					<li>Namn: ${input.namn}</li>
					<li>E-post: ${input.email}</li>
				</ul>
				<p>${input.description}</p>
			</div>
		`;

		type sendToHumanConfig = {
			sendTo: string;
			subject: string;
		};

		const config = (await getPluginConfig(
			"mega-assistant-alex-mailE-sendToHuman",
			organizationId
		)) as sendToHumanConfig;

		if (!config) {
			return Promise.resolve("Kunde inte hitta konfiguration för mail plugin.");
		}

		const { sendTo, subject } = config;
		await sendMail(sendTo, subject, html);

		return Promise.resolve(`Det lyckades!`);
	} catch (error) {
		console.error(error);
		return Promise.resolve("Kunde inte skicka mail! Försök igen senare.");
	}
};

export const sendMailToHumanTool = ({
	tags,
	conversationId,
	organizationId,
	config,
}: {
	tags: string[];
	conversationId: string;
	organizationId: string;
	config: {
		subject: string;
		sendTo: string;
	};
}): StructuredTool =>
	new DynamicStructuredTool({
		verbose: false,
		schema: sendMailToHumanToolInputZod,
		name: "skicka-mail-till-manniska",
		description: `Skicka mail till en människa.
Bra att använda när du behöver skicka ett mail till en riktig människa som jobbar på ditt företag.
Du kan inte ha en konversation med denna tool.
Du kan endast förmedla information till den som tar hand om mailen.
`,
		func: (input, _runManager) =>
			runFunction({ input, _runManager, conversationId, organizationId, config }),
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});

export default sendMailToHumanTool;
