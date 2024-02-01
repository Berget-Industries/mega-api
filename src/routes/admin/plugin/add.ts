import { Plugin } from "../../../models/index.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { globalEventTarget } from "../../../utils/globalEventTarget.ts";
import authenticationMiddleware from "../../../middleware/authenticationMiddleware.ts";
import systemAdminAuthenticationMiddleware from "../../../middleware/systemAdminAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../../utils/contextHandler.ts";

const router = new Router();
router.post(
	"/add",
	authenticationMiddleware,
	systemAdminAuthenticationMiddleware,
	async (ctx: Context) => {
		try {
			const { organizationId, name, type, isActivated, config, dependencies } =
				await ctx.request.body().value;

			if (
				!name ||
				!type ||
				!config ||
				!organizationId ||
				!dependencies ||
				isActivated === undefined
			) {
				handleResponsePartialContent(ctx, {
					status: "missing-information",
					message:
						"Saknar någon av dessa nycklar: organizationId, name, type, isActivated, config, dependencies. Kan inte aktivera plugin.",
				});
				return;
			}

			const foundPlugin = await Plugin.findOne({ name, organization: organizationId });
			if (foundPlugin) {
				handleResponsePartialContent(ctx, {
					status: "already-exciting",
					message: "Detta plugin existerar redan på denna organization.",
				});
			}

			const foundDependencies = await Plugin.find({
				$and: [
					{ organization: organizationId },
					{ name: { $in: dependencies } },
					{ isActivated: true },
				],
			}).exec();

			if (foundDependencies.length !== dependencies.length) {
				handleResponsePartialContent(ctx, {
					status: "missing-dependencies",
					message: "Organizationen saknar anda plugins, kan inte lägga till plugin.",
				});
			}

			const newPlugin = await Plugin.create({
				organization: organizationId,
				dependencies,
				isActivated,
				config,
				name,
				type,
			});

			if (name === "mailer") {
				globalEventTarget.dispatchEvent(new Event("update-plugins-mailer"));
			}

			handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades skapa ett nytt plugin.",
				plugin: newPlugin.toObject(),
			});
		} catch (error) {
			console.error(error);
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Ett internt fel har uppstått.",
			});
		}
	}
);

export default router;
