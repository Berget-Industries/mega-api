import runAlex from "./alex/run.ts";
import runEva from "./eva/run.ts";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import { ILLMOutput } from "../../models/Message.ts";

interface IRunMegaAssistantConfig {
	organizationId: string;
	conversationId: string;
	contactEmail: string;
	contactName: string;
	message: string;
}

export default async function runMegaAssistant({
	organizationId,
	conversationId,
	contactEmail,
	contactName,
	message,
}: IRunMegaAssistantConfig): Promise<ILLMOutput[]> {
	type alexConfig = {
		systemPrompt: string;
		plugins: string[];
		abilities: string;
	};

	const alexConfig = (await getPluginConfig("mega-assistant-alex", organizationId)) as alexConfig;
	const alex = await runAlex({
		organizationSystemPrompt: alexConfig.systemPrompt,
		organizationPlugins: alexConfig.plugins,
		organizationAbilities: alexConfig.abilities,
		organizationId,
		conversationId,
		input: message,
	});

	type evaConfig = {
		systemPrompt: string;
		model: string;
	};

	const evaConfig = (await getPluginConfig("mega-assistant-eva", organizationId)) as
		| evaConfig
		| undefined;

	if (!evaConfig) {
		return Promise.resolve([alex]);
	}

	const eva = await runEva({
		organizationSystemPrompt: evaConfig.systemPrompt,
		organizationModel: evaConfig.model,
		mailToReWrite: alex.output,
		nameOfUser: contactName,
	});

	return Promise.resolve([alex, eva]);
}
