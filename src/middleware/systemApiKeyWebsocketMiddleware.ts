import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ApiKey } from "../models/index.ts";

export default async function systemApiKeyMiddleware(ctx: Context, next: Next) {
	try {
		const key = ctx.request.headers.get("Authorization");
		const keyDoc = await ApiKey.findOne({ key });

		if (!keyDoc || keyDoc?.systemKey !== true) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Invalid key!" };
			return;
		}

		await next();
	} catch (error) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Invalid key!" };
		console.error(error);
	}
}
