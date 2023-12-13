import { Context, Next } from "https://deno.land/x/oak/mod.ts";
import { Organization } from "../models/index.ts";

export default async function checkOrganizationAccess(ctx: Context, next: Next) {
	// const userId = ctx.state.session.user._id;
	const userOrganizations = ctx.state.session.user.organizations;
	const requestedOrganization: string | null = ctx.request.hasBody
		? (await ctx.request.body().value).organization
		: ctx.request.url.searchParams.get("organization");

	const organizationDoc = await Organization.findById(requestedOrganization);

	if (
		userOrganizations &&
		requestedOrganization &&
		organizationDoc &&
		userOrganizations.includes(requestedOrganization)
	) {
		await next();
	} else {
		ctx.response.status = 404;
		ctx.response.body = {
			status: "error",
			message: "Unauthorized",
		};
		return;
	}
}
