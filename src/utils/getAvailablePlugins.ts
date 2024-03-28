type availablePluginType = "input" | "chain" | "tool";
type availablePlugin = {
	name: string;
	type: availablePluginType;
	defaultConfig: Record<string, any>;
	dependencies: string[] | string[][];
};

type DefaultConfigChatClient = {
	greeting: string;
	color: string;
	name: string;
};

type DefaultConfigMailer = {
	apiKey: string;
	autoFilter: boolean;
	mainInbox: string;
	imapConfig: {
		user: string;
		password: string;
		host: string;
		port: number;
		tls: boolean;
		tlsOptions: { rejectUnauthorized: boolean };
	};
	nodeMailerConfig: {
		host: string;
		port: number;
		secure: boolean;
		auth: {
			user: string;
			pass: string;
		};
	};
};

const inputPlugins: availablePlugin[] = [
	{
		name: "chat-client",
		type: "input",
		defaultConfig: {
			greeting: "",
			color: "",
			name: "",
		} as DefaultConfigChatClient,
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
		} as DefaultConfigMailer,
		dependencies: [["mega-assistant-alex", "auto-filter"]],
	},
];

type DefaultConfigMegaAssistantAlex = {
	systemPrompt: string;
	abilities: string;
	tools: string[];
};

type DefaultConfigMegaAssistantEva = {
	systemPrompt: string;
	model: string;
};

type DefaultConfigAutoFilter = {
	rules: Record<string, string>;
};

type DefaultConfigChainStarter = {
	systemPrompt: string;
};

const chainPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			abilities: "",
			tools: [],
		} as DefaultConfigMegaAssistantAlex,
		dependencies: [],
	},
	{
		name: "mega-assistant-eva",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			model: "gpt-4-1106-preview",
		} as DefaultConfigMegaAssistantEva,
		dependencies: ["mega-assistant-alex"],
	},
	{
		name: "auto-filter",
		type: "chain",
		defaultConfig: {
			rules: {
				Manuell: "Allt som inte passar in på något annat hamnar här.",
			},
		} as DefaultConfigAutoFilter,
		dependencies: ["mailer"],
	},
	{
		name: "chain-starter",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
		} as DefaultConfigChainStarter,
		dependencies: ["mailer"],
	},
];

type DefaultConfigMegaAssistantAlexWaiteraid = {
	chambre: boolean;
	apiKey: string;
};

type DefaultConfigMegaAssistantAlexMailESendToHuman = {
	sendTo: string;
	subject: string;
};

const toolPlugins: availablePlugin[] = [
	{
		name: "mega-assistant-alex-waiteraid",
		type: "tool",
		defaultConfig: {
			chambre: false,
			apiKey: "",
		} as DefaultConfigMegaAssistantAlexWaiteraid,
		dependencies: ["mega-assistant-alex"],
	},
	{
		name: "mega-assistant-alex-mailE-sendToHuman",
		type: "tool",
		defaultConfig: {
			sendTo: "",
			subject: "",
		} as DefaultConfigMegaAssistantAlexMailESendToHuman,
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
