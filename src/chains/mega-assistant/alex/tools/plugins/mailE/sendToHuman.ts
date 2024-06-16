import { z } from "npm:zod";
import { CallbackManagerForToolRun } from "npm:langchain/callbacks";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain/tools";
import { LoggerCallbackHandler } from "../../../../../callbackHandlers/index.ts";
import { sendMail } from "../../../../../../utils/emailSender.ts";
import getPluginConfig from "../../../../../../utils/getPluginConfig.ts";
import { PluginStat_MailE_SendMailToHuman } from "../../../../../../models/index.ts";

export const sendMailToHumanToolInputZod = z.object({
	namn: z.string().describe("Namnet på personen som du pratar med just."),
	email: z.string().email().describe("E-post till personen pratar med just nu."),
	description: z.string().describe("Beskriv vad personen är intresserad av"),
	category: z.string().describe("Välj en kategori för detta mailet från listan"),
});

const runFunction = async ({
	input,
	_runManager,
	conversationId,
	organizationId,
	config,
	pluginId,
}: {
	input: z.infer<typeof sendMailToHumanToolInputZod>;
	_runManager: CallbackManagerForToolRun | undefined;
	conversationId: string;
	organizationId: string;
	pluginId: string;
	config: {
		subject: string;
		sendTo: string;
		nameOfHuman: string;
		description: string;
		subjectForStats: string;
	};
}) => {
	try {
		const html = `
			<div>
				<h1>
					Rapportering!
				</h1>
				
				<ul>
					<li>Namn: ${input.namn}</li>
					<li>E-post: ${input.email}</li>
					<li>Ärende typ: ${input.category}</li>
				</ul>
				<p>${input.description}</p>
			</div>
		`;

		const { sendTo, subject } = config;
		await sendMail(sendTo, `${subject} (${input.category})`, html);

		const savedMailSentToHumanDoc = await PluginStat_MailE_SendMailToHuman.create({
			description: input.description,
			category: input.category,
			conversationId,
			organizationId,
			pluginId,
		});

		return Promise.resolve(`Det lyckades! Dokument Id: ${savedMailSentToHumanDoc._id}`);
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
	pluginId,
}: {
	tags: string[];
	conversationId: string;
	organizationId: string;
	pluginId: string;
	config: {
		subject: string;
		sendTo: string;
		nameOfHuman: string;
		description: string;
		subjectForStats: string;
	};
}): StructuredTool =>
	new DynamicStructuredTool({
		verbose: false,
		schema: sendMailToHumanToolInputZod,
		name: "skicka-mail-till-" + config.nameOfHuman,
		description: `${config.description}
		

Använd ENDAST dessa ämnen till mailet som ska skickas.
Varje rad har ett ämne. Du kan endast välja ett.	
${config.subjectForStats}`,
		func: (input, _runManager) =>
			runFunction({ input, pluginId, _runManager, conversationId, organizationId, config }),
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});

export default sendMailToHumanTool;
