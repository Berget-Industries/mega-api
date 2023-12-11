import { model, Schema } from "mongoose";

export interface IAction {
	type: "skapa-reservation" | "redigera-reservation" | "avboka-reservation";
	docId: string;
	date: Date;
	input: any;
	displayName: string;
}
export interface IUsedTokens {
	input: number;
	output: number;
	total: number;
}

export interface ILLMOutput {
	name: string;
	output: string;
	usedTokens: IUsedTokens;
	responseTime: number;
	actions: IAction[];
}

export interface IMessage {
	organization: { type: Schema.Types.ObjectId; ref: "Organization" };
	conversation: { type: Schema.Types.ObjectId; ref: "Conversation" };
	contact: { type: Schema.Types.ObjectId; ref: "Contact" };
	createdAt: Date;
	input: string;
	llmOutput: ILLMOutput[];
}

export default model<IMessage>(
	"Message",
	new Schema<IMessage>({
		organization: { type: Schema.Types.ObjectId, ref: "Organization" },
		conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
		contact: { type: Schema.Types.ObjectId, ref: "Contact" },
		createdAt: Date,
		input: String,
		llmOutput: Array,
	})
);
