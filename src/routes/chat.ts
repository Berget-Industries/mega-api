import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Conversation } from "../models/ConversationModel.ts";
import {
	getInvalidIdErrorMessage,
	getEditReservationErrorMessage,
} from "../utils/errorMessages.ts";
import mongoose from "mongoose";
import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";
import { Contact } from "../models/ContactModel.ts";

const router = new Router();

// ----------------------------------------------------------------------

export type IChatAttachment = {
	name: string;
	size: number;
	type: string;
	path: string;
	preview: string;
	createdAt: Date;
	modifiedAt: Date;
};

export type IChatMessage = {
	id: string;
	body: string;
	createdAt: Date;
	senderId: string;
	contentType: string;
	attachments: IChatAttachment[];
};

export type IChatParticipant = {
	id: string;
	name: string;
	role: string;
	email: string;
	address: string;
	avatarUrl: string;
	phoneNumber: string;
	lastActivity: Date;
	status: "online" | "offline" | "alway" | "busy";
};

export type IChatConversation = {
	id: string;
	type: string;
	unreadCount: number;
	messages: IChatMessage[];
	participants: IChatParticipant[];
};

export type IChatConversations = {
	byId: Record<string, IChatConversation>;
	allIds: string[];
};

async function getConversations(ctx: Context) {
	try {
		let conversations = await Conversation.find();

		ctx.response.status = 200;
		ctx.response.body = {
			conversations: conversations.map((_) => ({
				id: _._id,
				..._.toJSON(),
			})),
		};
		return;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			console.error(error);
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log("Fel inträffade: ", error);
	}
}

async function getContacts(ctx: Context) {
	{
		try {
			const contacts = await Contact.find();

			ctx.response.status = 200;
			ctx.response.body = {
				contacts: contacts.map((_) => {
					const { _id, ...rest } = _.toObject();
					return { id: _id, ...rest };
				}),
			};
		} catch (error) {
			console.error(error);
			ctx.response.status = 500;
			ctx.response.body = "fail";
		}
	}
}

async function getConversation(ctx: Context) {
	try {
		const queryParams = ctx.request.url.searchParams;
		const conversationId = queryParams.get("conversationId") as string;
		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return;
		}

		ctx.response.status = 200;
		ctx.response.body = { conversation: conversation.toJSON() };
		return;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			console.error(error);
			const body = getInvalidIdErrorMessage();
			ctx.response.status = 200;
			ctx.response.body = body;
			console.log(body);
			return;
		}
		const body = getEditReservationErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log("Fel inträffade: ", error);
	}
}

router.get("/chat", authenticationMiddleware, (ctx: Context) => {
	const queryParams = ctx.request.url.searchParams;
	const endpoint = queryParams.get("endpoint") as string;

	const availableEndpoints: Record<string, Function> = {
		conversations: getConversations,
		conversation: getConversation,
		contacts: getContacts,
	};

	if (endpoint && Object.keys(availableEndpoints).includes(endpoint)) {
		const func = availableEndpoints[endpoint];
		return func(ctx);
	} else {
		ctx.response.status = 501;
		ctx.response.body = "{message: 'Could not find endpoint!'}";
	}
});

export default router;
