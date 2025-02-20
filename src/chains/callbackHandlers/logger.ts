import colors from "npm:colors";
import { Serialized } from "npm:langchain/load/serializable";
import { BaseCallbackHandler } from "npm:@langchain/core/callbacks/base";
import { AgentAction, AgentFinish, ChainValues } from "npm:@langchain/core";

colors.bgBlack("");

export default class LoggerCallbackHandler extends BaseCallbackHandler {
	name = "LoggerCallbackHandler";

	// CHAIN
	async handleChainStart(
		chain: Serialized,
		inputs: ChainValues,
		runId: string,
		parentRunId?: string,
		tags?: string[],
		metadata?: Record<string, unknown>,
		runType?: string,
		name?: string
	) {
		const str = `[${tags?.[0]}] jobbar...`;
		console.log(str.bgYellow.black);
		console.log(inputs);
	}
	// AGENT
	async handleAgentAction(
		action: AgentAction,
		runId: string,
		parentRunId?: string,
		tags?: string[]
	) {
		const str = `[${tags?.[0]}] använder: [${action.tool}]`;
		const str2 = `\n${action.tool}(${JSON.stringify(action.toolInput, null, 4)})\n`;
		console.log(str.bgYellow.black + str2.yellow.black);
	}

	async handleAgentEnd(
		action: AgentFinish,
		runId: string,
		parentRunId?: string,
		tags?: string[]
	) {
		const str = `[${tags?.[0]}] Uppgiften är avklarad.`;
		console.log(str.bgGreen.black + "\n".bgBlack);
	}

	handleToolError(err: Error, runId: string, parentRunId?: string, tags?: string[]) {
		const str = `[${tags?.[0]}] tog sönder ${tags?.[1]} har havererat!`;
		const str2 = `\n${JSON.stringify(err, null, 4)}`.red;
		console.log(str.bgRed.black + str2.red);
	}

	handleToolEnd(output: string, runId: string, parentRunId?: string, tags?: string[]) {
		const str = `[${tags?.[0]}] observerar svar från [${tags?.[1]}]`;
		const str2 = `\n${output}\n`;
		console.log(str.bgCyan.black + str2.cyan);
	}
}
