import { Organization, Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import { handleResponseError, handleResponseSuccess } from "../../../utils/contextHandler.ts";

type IExportedOrganization = {
	name: string;
	logoUrl: string;
};

type IExportedPlugin = {
	name: string;
	type: string;
	isActivated: boolean;
	config: Record<string, unknown>;
};

const router = new Router();
router.post(
	"/import",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { importData } = await ctx.request.body().value;
			const { organization, plugins } = importData;

			if (
				typeof organization !== "object" ||
				typeof organization.name !== "string" ||
				typeof organization.logoUrl !== "string"
			) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Invalid organization format.",
				});
				return;
			}

			if (
				!Array.isArray(plugins) ||
				!plugins.every(
					(plugin) =>
						typeof plugin === "object" &&
						typeof plugin.name === "string" &&
						typeof plugin.type === "string" &&
						typeof plugin.isActivated === "boolean" &&
						typeof plugin.config === "object"
				)
			) {
				handleResponseError(ctx, {
					status: "bad-request",
					message: "Invalid plugins format.",
				});
				return;
			}

			const { name, logoUrl } = organization;
			const newOrganization = await Organization.create({
				plugins: [],
				logoUrl,
				users: [],
				name,
			});

			const newPlugins = await Promise.all(
				plugins.map(({ name, type, isActivated, config }: IExportedPlugin) =>
					Plugin.create({
						organizationId: newOrganization.id,
						isActivated,
						config,
						type,
						name,
					})
				)
			);

			await Organization.findByIdAndUpdate(newOrganization.id, {
				plugins: newPlugins.map((plugin) => plugin._id),
			});

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Successfully created an organization",
			});
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "An internal error occurred.",
			});
		}
	}
);

export default router;
