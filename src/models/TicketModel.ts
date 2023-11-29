import { model, Schema } from "mongoose";

interface IContact {
	name: string;
	email: string;
	phoneNumber: string;
	avatarUrl: string;
}

type TicketType = "ny-bokning" | "ändrad-bokning" | "avbokning" | "fråga" | "manuell";
interface IProcessedTicket {
	conversationId: string;
	id: string;
	date: Date;
	contact: IContact;
	responseTime: number;
	timeSaved: number;
	type: TicketType[];
	usedTokens: {
		total: number;
		input: number;
		output: number;
	};
}

export const TicketSchema = new Schema<IProcessedTicket>({
	id: { type: String, default: "", required: true },
	date: { type: Date },
	contact: { type: Object },
	responseTime: { type: Number },
	timeSaved: { type: Number },
	type: { type: Array },
	usedTokens: { type: Object },
	conversationId: { type: String },
});

export const Ticket = model<IProcessedTicket>("Ticket", TicketSchema);

export default Ticket;
