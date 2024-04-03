import mongoose from "npm:mongoose";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import saveChainMessage from "../../utils/saveChainMessage.ts";
import runAutoFilterChain from "../../chains/auto-filter/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../utils/contextHandler.ts";
import { ILLMOutput } from "../../models/Message.ts";
import { resolve } from "https://deno.land/std@0.200.0/path/resolve.ts";

const router = new Router();
router.post("/auto-filter", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { message, contactEmail, contactName, conversationId } = await ctx.request.body()
			.value;
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

		const allExamples = Object.keys(autoFilterConfig.rules);
		const randomExamples: string[] = [];

		for (let i = 0; i < allExamples.length / 5; i++) {
			const randomIndex = Math.random() * allExamples.length;
			randomExamples.push(allExamples[randomIndex]);
		}

		const llmOutput: ILLMOutput[] = [];
		const runAutoFilter = async (): Promise<void> => {
			const autoFilterLLMOutput = await runAutoFilterChain({
				organizationAbilities: megaAssistantAlexConfig?.abilities,
				organizationExamples: randomExamples.join("\n"),
				organizationRules: autoFilterConfig.rules,
				message,
			});

			llmOutput.push(autoFilterLLMOutput);

			if (
				allExamples.includes(autoFilterLLMOutput.output) ||
				autoFilterLLMOutput.output === "Bounce" ||
				autoFilterLLMOutput.output === "Auto-Reply" ||
				autoFilterLLMOutput.output === "MEGA-ASSISTANT" ||
				autoFilterLLMOutput.output === "OTHER"
			) {
				return Promise.resolve();
			}

			if (llmOutput.length >= 5) {
				return Promise.resolve();
			}

			return runAutoFilter();
		};

		await runAutoFilter();

		const savedMessage = await saveChainMessage({
			organizationId,
			conversationId,
			contactEmail,
			contactName,
			messageId: new mongoose.Types.ObjectId().toString(),
			createdAt: new Date(),
			llmOutput,
			input: message,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output:
				llmOutput.length > 0 && llmOutput.length <= 5
					? llmOutput[llmOutput.length - 1].output
					: "OTHER",
			...savedMessage,
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
