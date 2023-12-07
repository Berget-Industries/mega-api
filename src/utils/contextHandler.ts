import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export function handleResponseSuccess(ctx: Context, body: any) {
	ctx.response.body = body;
	ctx.response.status = 200;
	return;
}

export function handleResponseError(ctx: Context, body: any) {
	ctx.response.status = 500;
	ctx.response.body = body;
	return;
}
