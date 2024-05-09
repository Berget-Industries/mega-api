import runEva from "./eva/run.ts";
import runAlex from "./alex/run.ts";
import runStreamEva from "./eva/runStream.ts";
import runStreamAlex from "./alex/runStream.ts";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import { ILLMOutput } from "../../models/Message.ts";

export interface IMegaAssistantStreamChunk {
	token: string;
	assistant: string;
	role: "thinker" | "speaker";
	conversationId: string;
}

interface IRunMegaAssistantConfig {
	onStreamChunk: (chunk: IMegaAssistantStreamChunk) => void;
	organizationId: string;
	conversationId: string;
	contactEmail: string;
	contactName: string;
	message: string;
}

export async function runMegaAssistantStream({
	onStreamChunk,
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
	type evaConfig = {
		systemPrompt: string;
		model: string;
	};

	const alexConfig = (await getPluginConfig("mega-assistant-alex", organizationId)) as alexConfig;
	const evaConfig = (await getPluginConfig("mega-assistant-eva", organizationId)) as
		| evaConfig
		| undefined;

	console.log(alexConfig);

	const alex = await runStreamAlex({
		organizationSystemPrompt: alexConfig.systemPrompt,
		organizationPlugins: alexConfig.plugins,
		organizationAbilities: alexConfig.abilities,
		organizationId,
		conversationId,
		input: message,
		onStreamChunk: (token: string) =>
			onStreamChunk({
				token,
				assistant: "Alex",
				role: evaConfig ? "thinker" : "speaker",
				conversationId,
			}),
	});

	if (!evaConfig) {
		console.log("No Eva config found");
		return Promise.resolve([alex]);
	}

	const eva = await runStreamEva({
		organizationSystemPrompt: evaConfig.systemPrompt,
		organizationModel: evaConfig.model,
		mailToReWrite: alex.output,
		nameOfUser: contactName,
		onStreamChunk: (token: string) =>
			onStreamChunk({ token, assistant: "Eva", role: "speaker", conversationId }),
	});

	return Promise.resolve([alex, eva]);
}

export default runMegaAssistantStream;
