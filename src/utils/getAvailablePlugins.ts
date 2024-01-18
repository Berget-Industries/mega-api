type availablePlugin = {
	name: string;
	type: string;
	defaultConfig: Record<string, any>;
};

const inputPlugins: availablePlugin[] = [
	{
		name: "chat-client",
		type: "input",
		defaultConfig: {
			systemPrompt: "",
			tools: [],
		},
	},
	{
		name: "mailer",
		type: "input",
		defaultConfig: {
			systemPrompt: "",
			tools: [],
		},
	},
];

const chainPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			tools: [],
		},
	},
	{
		name: "mega-assistant-eva",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			model: "gpt-4-1106-preview",
		},
	},
	{
		name: "manualFilter",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
		},
	},
];

const toolPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex-waiteraid",
		type: "tool",
		defaultConfig: {
			chambre: true,
			apiKey: "",
		},
	},
];

const availablePlugins: availablePlugin[] = [...inputPlugins, ...chainPlugins, ...toolPlugins];

export function getAvaialblePlugins(): availablePlugin[] {
	return availablePlugins;
}
export function isPluginAvaialble(name: string): boolean {
	const foundPlugin = availablePlugins.some((_) => _.name === name);
	return foundPlugin;
}
