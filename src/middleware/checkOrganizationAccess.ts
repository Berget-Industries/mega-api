import { Context, Next } from "https://deno.land/x/oak/mod.ts";

export default async function checkOrganizationAccess(ctx: Context, next: Next) {
	const userOrganizations = ctx.state.session.user.organizations;
	const body = await ctx.request.body().value;
	const requestedOrganization = body.organization;

	if (
		userOrganizations &&
		requestedOrganization &&
		userOrganizations.includes(requestedOrganization)
	) {
		await next();
	} else {
		ctx.response.status = 401;
		ctx.response.body = { message: "Unauthorized" };
	}
}
