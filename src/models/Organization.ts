import { model, Schema, Types } from "npm:mongoose";

interface IMailerConfig {
	imapConfig: object;
	mainInbox: string;
	manualFilter: boolean;
}

interface IAgentConfig {
	manualFilter: {
		active: boolean;
		systemPrompt: string;
	};
	alex: {
		active: boolean;
		systemPrompt: string;
		tools: string[];
	};
	eva: {
		active: boolean;
		systemPrompt: string;
	};
}

export interface IOrganization {
	name: string;
	logoUrl: string;
	users: Types.ObjectId[];
	conversations: Types.ObjectId[];
	messages: Types.ObjectId[];
	agentConfig: IAgentConfig;
	mailerConfig: IMailerConfig;
}

export default model<IOrganization>(
	"Organization",
	new Schema({
		name: String,
		logoUrl: String,
		users: [{ type: Types.ObjectId, ref: "User" }],
		conversations: [{ type: Types.ObjectId, ref: "Conversation" }],
		messages: [{ type: Types.ObjectId, ref: "Message" }],
		agentConfig: Object,
		mailerConfig: Object,
	})
);
