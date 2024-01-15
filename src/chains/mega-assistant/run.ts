import runAlex from "./alex/run.ts";
import runEva from "./eva/run.ts";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import saveAssistantMessage from "../../utils/saveAssistantMessage.ts";

interface IRunMegaAssistantConfig {
	organizationId: string;
	conversationId: string;
	contactEmail: string;
	contactName: string;
	input: string;
}

export default async function runMegaAssistant({
	organizationId,
	conversationId,
	contactEmail,
	contactName,
	input,
}: IRunMegaAssistantConfig) {
	const alexConfig = await getPluginConfig("mega-assistant-alex", organizationId);
	const alex = await runAlex({
		organizationSystemPrompt: alexConfig.systemPrompt,
		organizationPlugins: alexConfig.plugins,
		conversationId,
		input,
	});

	const evaConfig = await getPluginConfig("mega-assistant-eva", organizationId);
	const eva = await runEva({
		organizationSystemPrompt: evaConfig.systemPrompt,
		organizationModel: evaConfig.model,
		mailToReWrite: alex.output,
		nameOfUser: contactName,
	});

	await saveAssistantMessage({
		organizationId,
		conversationId,
		contactEmail,
		contactName,
		createdAt: Date.now(),
		llmOutput: [alex, eva],
		input,
	});
}
