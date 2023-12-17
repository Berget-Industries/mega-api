import { Context, Next } from "https://deno.land/x/oak/mod.ts";

export default async function systemAdminAuthenticationMiddleware(ctx: Context, next: Next) {
	if (ctx.state.session.user.systemAdmin) {
		await next();
	} else {
		ctx.response.status = 401;
		ctx.response.body = "unauthorized";
		return;
	}
}
