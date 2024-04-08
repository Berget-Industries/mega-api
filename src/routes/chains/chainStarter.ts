import mongoose from "npm:mongoose";
import AlexMemory from "../../models/AlexMemory.ts";
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
		const { contactEmail, contactName, contactInformation, messageInstructions, writeOnly } =
			await ctx.request.body().value;
		const organizationId = ctx.state.organizationId;

		if (!contactEmail || !contactName || !contactInformation) {
			handleResponseError(ctx, {
				status: "missing-info",
				message: "Kontrollera att du har fyllt i all information.",
			});
		}

		type chainStarterConfig = {
			systemPrompt: string;
			signature: string;
			subject?: string;
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

		const chainStarterOutput: ILLMOutput = await runChainStarterChain({
			organizationSystemMessage: chainStarterConfig.systemPrompt,
			messageInstructions,
			contactInformation,
			contactName,
		});

		const llmOutputs: ILLMOutput[] = [chainStarterOutput];

		if (!chainStarterConfig.subject) {
			const mailSubjectOutput = await runMailSubjector({
				assistantMessage: chainStarterOutput.output,
				userMessage: "",
			});
			llmOutputs.push(mailSubjectOutput);
		}

		const messageInput = `
Jag heter ${contactName} och min epost är ${contactEmail}.
Lite kort information om mig: 
${contactInformation}
`;

		const savedMessage = await saveChainMessage({
			organizationId,
			conversationId: "",
			contactEmail,
			contactName,
			messageId: new mongoose.Types.ObjectId().toString(),
			createdAt: new Date(),
			llmOutput: llmOutputs,
			input: messageInput,
		});

		if (!savedMessage) {
			handleResponseError(ctx, {
				status: "error",
				message: "Nånting gick fel.",
			});
			return;
		}

		await AlexMemory.create({
			_id: savedMessage.conversationId,
			messages: [
				{
					type: "human",
					data: {
						content: messageInput,
						additional_kwargs: {},
					},
				},
				{
					type: "ai",
					data: {
						content: chainStarterOutput.output,
						additional_kwargs: {},
					},
				},
			],
		});

		if (!writeOnly) {
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

			globalEventTarget.dispatchEvent(
				new CustomEvent("chain-starter-send-mail", {
					detail: {
						to: contactEmail,
						from: mailerConfig.nodemailerConfig.auth.user,
						subject: chainStarterConfig.subject
							? chainStarterConfig.subject
							: (llmOutputs[1]?.output || "") + " | " + savedMessage.conversationId,
						text:
							chainStarterOutput.output + `\n\n\n\n\n${chainStarterConfig.signature}`,
					},
				})
			);
		}

		handleResponseSuccess(ctx, {
			status: "success",
			message: "",
			output: chainStarterOutput.output,
			content: {
				signature: chainStarterConfig.signature,
				message: chainStarterOutput.output,
				subject: `${
					chainStarterConfig.subject ? chainStarterConfig.subject : llmOutputs[1]?.output
				} | ${savedMessage.conversationId}`,
			},
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
