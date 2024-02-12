import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Organization } from "../models/index.ts";
import { Types } from "npm:mongoose";

export default async function checkOrganizationAccess(ctx: Context, next: Next) {
	const user = ctx.state.session.user;
	const userId = user.id.toString();
	const userOrganizations = ctx.state.session.user.organizations.map((_: Types.ObjectId) =>
		_.toString()
	);

	const requestedOrganization: string | null = ctx.request.hasBody
		? (await ctx.request.body().value).organization
		: ctx.request.url.searchParams.get("organization");

	const organizationDoc = await Organization.findById(requestedOrganization);
	if (!organizationDoc) {
		ctx.response.status = 404;
		ctx.response.body = {
			status: "error",
			message: "Invalid organization",
		};
		return;
	}

	if (user.systemAdmin) {
		ctx.state.organization = organizationDoc._id;
		await next();
		return;
	}

	const organizationUsers = organizationDoc.users.map((_: Types.ObjectId) => _.toString());

	const isUserInOrg = organizationUsers.includes(userId);
	const isOrgInUser = userOrganizations.includes(requestedOrganization);

	if (isUserInOrg && isOrgInUser) {
		ctx.state.organization = organizationDoc._id;
		await next();
	} else {
		ctx.response.status = 401;
		ctx.response.body = {
			status: "error",
			message: "Unauthorized",
		};
		return;
	}
}
