import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getAvailableChambreDatesErrorMessage } from "../utils/errorMessages.ts";

import Ticket from "../models/TicketModel.ts";

const router = new Router();
async function getAllTickets(ctx: Context) {
	try {
		const tickets = await Ticket.find();

		const body = { tickets: tickets.map((_) => _.toObject()) };
		ctx.response.status = 200;
		ctx.response.body = body;
		console.log(body);
	} catch (error) {
		const body = getAvailableChambreDatesErrorMessage(error);
		ctx.response.status = 500;
		ctx.response.body = body;
		console.log(body);
		console.log("Fel inträffade: ", error);
	}
}

router.get("/getAllTickets", getAllTickets);

export default router;
