import { Context, Next } from "https://deno.land/x/oak/mod.ts";
import { ApiKey } from "../models/index.ts";

export default async function apiKeyAuthenticationMiddleware(ctx: Context, next: Next) {
	try {
		const key = ctx.request.headers.get("Authorization");
		const keyDoc = await ApiKey.findOne({ key });

		if (!keyDoc) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		await next();
	} catch (error) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Invalid key!" };
		console.error(error);
	}
}
