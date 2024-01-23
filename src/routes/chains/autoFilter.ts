import mongoose from "npm:mongoose";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import runAutoFilterChain from "../../chains/auto-filter/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../utils/contextHandler.ts";

const router = new Router();
router.post("/auto-filter", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { message } = await ctx.request.body().value;
		const organizationId = ctx.state.organizationId;

		if (!message) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "message saknas i body",
			});
		}

		type autoFilterConifg =
			| {
					rules: Record<string, string>;
					exemples: string;
			  }
			| undefined;

		const autoFilterConfig = (await getPluginConfig(
			"auto-filter",
			organizationId
		)) as autoFilterConifg;

		if (!autoFilterConfig) {
			handleResponsePartialContent(ctx, {
				status: "plugin-not-activated",
				message: "Pluginet är inte aktiverat.",
			});
			return;
		}
		type megaAssistantAlexConfig =
			| {
					systemPrompt: string;
					abilities: string;
					plugins: string[];
			  }
			| undefined;

		const megaAssistantAlexConfig = (await getPluginConfig(
			"mega-assistant-alex",
			organizationId
		)) as megaAssistantAlexConfig;

		const { output, usedTokens } = await runAutoFilterChain({
			organizationAbilities: megaAssistantAlexConfig?.abilities,
			organizationExamples: autoFilterConfig.exemples,
			organizationRules: autoFilterConfig.rules,
			message,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output,
		});
	} catch (error) {
		console.error(error);
		if (error instanceof mongoose.Error.CastError) {
			handleResponseError(ctx, {
				status: "error",
				message: "Nånting gick fel.",
			});
			return;
		}
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Tekniskt fel.",
		});
	}
});

export default router;
