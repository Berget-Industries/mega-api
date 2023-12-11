import { model, Schema, Types } from "npm:mongoose";

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
	organization: Types.ObjectId;
	conversation: Types.ObjectId;
	contact: Types.ObjectId;
	createdAt: Date;
	input: string;
	llmOutput: ILLMOutput[];
}

export default model<IMessage>(
	"Message",
	new Schema<IMessage>({
		organization: { type: Types.ObjectId, ref: "Organization" },
		conversation: { type: Types.ObjectId, ref: "Conversation" },
		contact: { type: Types.ObjectId, ref: "Contact" },
		createdAt: Date,
		input: String,
		llmOutput: Array,
	})
);
