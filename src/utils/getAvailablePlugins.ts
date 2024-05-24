type availablePluginType = "input" | "chain" | "tool";
type availablePlugin = {
	name: string;
	type: availablePluginType;
	defaultConfig: Record<string, any>;
	dependencies: string[] | string[][];
	allowMultiple: boolean;
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
		allowMultiple: true,
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
			nodeMailerConfig: {
				host: "",
				port: 456,
				secure: true,
				auth: {
					user: "",
					pass: "",
				},
			},
		} as DefaultConfigMailer,
		dependencies: [["mega-assistant-alex", "auto-filter"]],
		allowMultiple: true,
	},
];

type DefaultConfigMegaAssistantAlex = {
	systemPrompt: string;
	abilities: string;
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
		} as DefaultConfigMegaAssistantAlex,
		dependencies: [],
		allowMultiple: false,
	},
	{
		name: "mega-assistant-eva",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
			model: "gpt-4o",
		} as DefaultConfigMegaAssistantEva,
		dependencies: ["mega-assistant-alex"],
		allowMultiple: false,
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
		allowMultiple: false,
	},
	{
		name: "chain-starter",
		type: "chain",
		defaultConfig: {
			systemPrompt: "",
		} as DefaultConfigChainStarter,
		dependencies: ["mailer"],
		allowMultiple: false,
	},
];

type DefaultConfigMegaAssistantAlexWaiteraid = {
	chambre: boolean;
	apiKey: string;
};

type DefaultConfigMegaAssistantAlexMailESendToHuman = {
	subject: string;
	sendTo: string;
	nameOfHuman: string;
	description: string;
	onSuccess: string;
};

const toolPlugins: availablePlugin[] = [
	// {
	// 	name: "mega-assistant-alex-waiteraid",
	// 	type: "tool",
	// 	defaultConfig: {
	// 		chambre: false,
	// 		apiKey: "",
	// 	} as DefaultConfigMegaAssistantAlexWaiteraid,
	// 	dependencies: ["mega-assistant-alex"],
	// },
	{
		name: "mega-assistant-alex-mailE-sendToHuman",
		type: "tool",
		defaultConfig: {
			subject: "",
			sendTo: "",
			nameOfHuman: "",
			description: "",
			onSuccess: "",
		} as DefaultConfigMegaAssistantAlexMailESendToHuman,
		dependencies: ["mega-assistant-alex"],
		allowMultiple: true,
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
