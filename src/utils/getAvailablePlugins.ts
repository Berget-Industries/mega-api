type availablePlugin = {
	name: string;
	type: string;
	defaultConfig: Record<string, any>;
	dependencies: string[] | string[][];
};

const inputPlugins: availablePlugin[] = [
	{
		name: "chat-client",
		type: "input",
		defaultConfig: {
			greeting: "",
			color: "",
			name: "",
		},
		dependencies: ["mega-assistant-alex"],
	},
	{
		name: "mailer",
		type: "input",
		defaultConfig: {
			apiKey: "",
			autoFilter: false,
			mainInbox: "[Gmail]/Alla mail",
			imapConfig: {
				user: "",
				password: "",
				host: "",
				port: 993,
				tls: true,
				tlsOptions: { rejectUnauthorized: false },
			},
		},
		dependencies: [["mega-assistant-alex", "auto-filter"]],
	},
];

const chainPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			abilities: "",
			tools: [],
		},
		dependencies: [],
	},
	{
		name: "mega-assistant-eva",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			model: "gpt-4-1106-preview",
		},
		dependencies: ["mega-assistant-alex"],
	},
	{
		name: "auto-filter",
		type: "chain",
		defaultConfig: {
			rules: {
				Manuell: "Allt som inte passar in på något annat hamnar här.",
			},
		},
		dependencies: ["mailer"],
	},
];

const toolPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex-waiteraid",
		type: "tool",
		defaultConfig: {
			chambre: false,
			apiKey: "",
		},
		dependencies: ["mega-assistant-alex"],
	},
];

const availablePlugins: availablePlugin[] = [...inputPlugins, ...chainPlugins, ...toolPlugins];

export function getAvailablePlugins(): availablePlugin[] {
	return availablePlugins;
}
export function isPluginAvaialble(name: string): boolean {
	const foundPlugin = availablePlugins.some((_) => _.name === name);
	return foundPlugin;
}
export function findPlugin(name: string): availablePlugin | undefined {
	const foundPlugin = availablePlugins.find((_) => _.name === name);
	return foundPlugin;
}
