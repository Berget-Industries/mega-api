import { CallbackManagerForToolRun } from "npm:langchain/callbacks";
import { DynamicTool, StructuredTool } from "npm:langchain/tools";
import { LoggerCallbackHandler } from "../../../callbackHandlers/index.ts";
import moment from "npm:moment";

const runFunction = async (input: string, _runManager: CallbackManagerForToolRun | undefined) => {
	const now = moment();
	const currentDate = now.format("YYYY-MM-DD");
	const currentTime = now.format("HH:mm");

	return Promise.resolve(
		JSON.stringify({
			currentDate,
			currentTime,
		})
	);
};

export default function getCurrentDateAndTimeTool({ tags }: { tags: string[] }): StructuredTool {
	return new DynamicTool({
		verbose: false,
		name: "get-current-date-and-time",
		description: `användbart när du vill veta vad det är för datum idag eller vad klockan är just nu.
    användbart när du behöver förstå vilket datum personen pratar om.
    till exemple om personen säger ett datum som andra mars måste du förstå vilket år personen menar. personen kan ju inte boka den andra mars förra året.
  `,
		func: runFunction,
		tags,
		callbacks: [new LoggerCallbackHandler()],
	});
}
