import { Context, Next } from "https://deno.land/x/oak/mod.ts";
import { verify } from "npm:jsonwebtoken";

export default async function authenticationMiddleware(ctx: Context, next: Next) {
	try {
		const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

		if (!token) {
			throw "unauthorized";
		}

		const payload = await verify(token, Deno.env.get("JWT_SECRET"));

		ctx.state.organization = payload.organization;

		await next();
	} catch (error) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Invalid or expired token" };
		console.error(error);
	}
}
