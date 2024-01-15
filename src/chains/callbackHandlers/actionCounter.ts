import { Serialized } from "npm:langchain@^0.0.159/load/serializable";
import { BaseCallbackHandler } from "npm:langchain@^0.0.159/callbacks";
import { AgentAction, AgentFinish, ChainValues } from "npm:langchain@^0.0.159/schema";

type onAction = (some: any) => void;

export default class ActionCounterCallbackHandler extends BaseCallbackHandler {
	name = "ActionCounterCallbackHandler";
	actions: Record<
		string,
		{
			type: "skapa-reservation" | "redigera-reservation" | "avboka-reservation";
			docId: string;
			date: Date;
			input: string;
		}
	> = {};

	onAction: onAction;

	constructor(onAction: onAction) {
		super();
		this.onAction = onAction;
	}

	handleAgentAction(
		action: AgentAction,
		runId: string,
		parentRunId?: string | undefined,
		tags?: string[] | undefined
	): void | Promise<void> {
		const type = action.tool;

		if (
			type === "skapa-reservation" ||
			type === "redigera-reservation" ||
			type === "avboka-reservation"
		) {
			console.log(type);
			this.actions[runId] = { ...this.actions[runId], type };
		}
	}

	handleToolStart(
		tool: Serialized,
		input: string,
		runId: string,
		parentRunId?: string | undefined,
		tags?: string[] | undefined,
		metadata?: Record<string, unknown> | undefined
	) {
		if (parentRunId && Object.keys(this.actions).includes(parentRunId)) {
			this.actions[parentRunId] = {
				...this.actions[parentRunId],
				input,
			};
		}
	}

	handleToolEnd(
		output: string,
		runId: string,
		parentRunId?: string | undefined,
		tags?: string[] | undefined
	) {
		if (parentRunId && Object.keys(this.actions).includes(parentRunId)) {
			if (output.startsWith("Det lyckades!")) {
				const parts = output.split(": ");
				const idAndMessage = parts[parts.length - 1].split(" ");
				const docId = idAndMessage[0];

				this.actions[parentRunId] = {
					...this.actions[parentRunId],
					docId,
					date: new Date(),
				};
			} else {
				delete this.actions[parentRunId];
			}
		}
	}
}
