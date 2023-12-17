import { Context, Next } from "https://deno.land/x/oak/mod.ts";

import { getSession } from "../utils/sessionStore.ts";
import { verify } from "../utils/jwt.ts";

export default async function authenticationMiddleware(ctx: Context, next: Next) {
	const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

	if (!token) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Unauthorized" };
		return;
	}

	try {
		const payload = await verify(token);
		const session = await getSession(token);
		if (!session || session.user.email !== payload.email) {
			throw new Error("Invalid session");
		}

		ctx.state.session = session;

		await next();
	} catch (error) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Invalid or expired token" };
		console.error(error);
	}
}
