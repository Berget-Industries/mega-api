import mongoose from "npm:mongoose";
import getPluginConfig from "../../utils/getPluginConfig.ts";
import saveChainMessage from "../../utils/saveChainMessage.ts";
import runMailSubjector from "../../chains/mailSubjector/run.ts";
import runChainStarterChain from "../../chains/chain-starter/run.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import apiKeyAuthenticationMiddleware from "../../middleware/apiKeyAuthenticationMiddleware.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponsePartialContent,
} from "../../utils/contextHandler.ts";
import { ILLMOutput } from "../../models/Message.ts";
import { globalEventTarget } from "../../utils/globalEventTarget.ts";

const router = new Router();
router.post("/chain-starter", apiKeyAuthenticationMiddleware, async (ctx: Context) => {
	try {
		const { contactEmail, contactName, contactInformation, messageInstructions } =
			await ctx.request.body().value;
		const organizationId = ctx.state.organizationId;

		if (!contactEmail || !contactName || !contactInformation) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "Kontrollera att du har fyllt i all information.",
			});
		}

		type chainStarterConfig = {
			systemMessage: string;
			signature: string;
		};

		const chainStarterConfig = (await getPluginConfig("chain-starter", organizationId)) as
			| chainStarterConfig
			| undefined;

		if (!chainStarterConfig) {
			handleResponsePartialContent(ctx, {
				status: "plugin-not-activated",
				message: "Pluginet är inte aktiverat.",
			});
			return;
		}

		type mailerConfig = {
			nodemailerConfig: {
				host: string;
				port: number;
				auth: {
					user: string;
					pass: string;
				};
			};
		};

		const mailerConfig = (await getPluginConfig("mailer", organizationId)) as
			| mailerConfig
			| undefined;

		if (!mailerConfig) {
			handleResponsePartialContent(ctx, {
				status: "plugin-not-activated",
				message: "Pluginet är inte aktiverat.",
			});
			return;
		}

		const llmOutput: ILLMOutput = await runChainStarterChain({
			organizationSystemMessage: chainStarterConfig.systemMessage,
			messageInstructions,
			contactInformation,
			contactName,
		});

		const mailSubjectOutput = await runMailSubjector({
			userMessage: chainStarterConfig.systemMessage + messageInstructions,
			assistantMessage: llmOutput.output,
		});

		globalEventTarget.dispatchEvent(
			new CustomEvent("chain-starter-send-mail", {
				detail: {
					from: mailerConfig.nodemailerConfig.auth.user,
					to: contactEmail,
					subject: mailSubjectOutput.output,
					text: llmOutput.output + `\n\n\n\n\n${chainStarterConfig.signature}`,
				},
			})
		);

		const savedMessage = await saveChainMessage({
			organizationId,
			conversationId: "",
			contactEmail,
			contactName,
			messageId: new mongoose.Types.ObjectId().toString(),
			createdAt: new Date(),
			llmOutput: [llmOutput],
			input: `Namn: ${contactName}\nE-post: ${contactEmail}\nKontaktinformation: ${contactInformation}`,
		});

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output: llmOutput.output,
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
