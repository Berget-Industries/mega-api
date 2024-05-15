import { Serialized } from "npm:@langchain/core/serializable";
import { BaseCallbackHandler } from "npm:@langchain/core/callbacks/base";
import { AgentAction, AgentFinish, ChainValues } from "npm:@langchain/core";
import { IAction } from "../../models/Message.ts";

type onAction = (action: IAction) => void;

export default class ActionCounterCallbackHandler extends BaseCallbackHandler {
	name = "ActionCounterCallbackHandler";
	actions: Record<
		string,
		{
			type:
				| "skapa-reservation"
				| "redigera-reservation"
				| "avboka-reservation"
				| "skicka-mail-till-manniska"
				| "skapa-kalenderhandelse";
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
			type === "avboka-reservation" ||
			type === "skicka-mail-till-manniska" ||
			type === "skapa-kalenderhandelse"
		) {
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
				const docId = `${output}`.replace("Det lyckades! Dokument Id: ", "").split(": ")[0];

				this.actions[parentRunId] = {
					...this.actions[parentRunId],
					docId,
					date: new Date(),
				};

				this.onAction(this.actions[parentRunId]);
			} else {
				delete this.actions[parentRunId];
			}
		}
	}
}
