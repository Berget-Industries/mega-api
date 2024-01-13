import { ChatPromptTemplate } from "npm:langchain@^0.0.159/prompts";
import AgentCallbackHandler from "../callbackHandler.ts";
import { systemPrompt } from "./prompts.ts";
import { ChatOpenAI } from "npm:langchain@^0.0.159/chat_models/openai";
import { LLMChain } from "npm:langchain@^0.0.159/chains";

type agentInput = {
	message: string;
	organizationSystemPrompt: string;
};

export default async function runManualFilterChain({
	message,
	organizationSystemPrompt,
}: agentInput) {
	const agentName = "El Manuel";

	let usedTokens = { input: 0, output: 0, total: 0 };

	const llm = new ChatOpenAI({
		modelName: "gpt-4-1106-preview",
		temperature: 0,
		callbacks: [
			{
				handleLLMEnd: (output, runId, parentRunId?, tags?) => {
					const { completionTokens, promptTokens, totalTokens } =
						output.llmOutput?.tokenUsage;
					usedTokens.output += completionTokens ?? 0;
					usedTokens.input += promptTokens ?? 0;
					usedTokens.total += totalTokens ?? 0;
				},
			},
		],
	});

	const chatPrompt = ChatPromptTemplate.fromMessages([
		["system", systemPrompt(organizationSystemPrompt)],
		[
			"human",
			`
Meddelande:
{message}
`,
		],
	]);

	const chain = new LLMChain({
		callbacks: [new AgentCallbackHandler()],
		outputKey: "output",
		prompt: chatPrompt,
		tags: [agentName],
		llm,
	});

	const { output } = await chain.call({
		message,
	});

	return Promise.resolve({
		output,
		usedTokens,
	});
}
