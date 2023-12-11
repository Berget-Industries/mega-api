import { Context, Next } from "https://deno.land/x/oak/mod.ts";
import { AiAccessKey } from "../models/index.ts";

export default async function aiAuthenticationMiddleware(ctx: Context, next: Next) {
	try {
		const key = ctx.request.headers.get("Authorization");
		console.log(key);
		const keyDoc = await AiAccessKey.findOne({ key });

		if (!keyDoc) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		ctx.state.organization = keyDoc.organization;

		await next();
	} catch (error) {
		ctx.response.status = 401;
		ctx.response.body = { message: "Invalid key!" };
		console.error(error);
	}
}
