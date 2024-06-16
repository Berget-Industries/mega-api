import { model, Schema, Types } from "npm:mongoose";

interface ISendMailToHuman {
	category: string;
	description: string;
	organizationId: Types.ObjectId;
	conversationId: Types.ObjectId;
	pluginId: Types.ObjectId;
	date: Date;
}

export default model<ISendMailToHuman>(
	"PluginStat_MailE_SendToHuman",
	new Schema({
		category: String,
		description: String,
		organizationId: { type: Types.ObjectId, ref: "Organization" },
		conversationId: { type: Types.ObjectId, ref: "Conversation" },
		pluginId: { type: Types.ObjectId, ref: "Plugin" },
		date: { type: Date, default: new Date() },
	})
);
