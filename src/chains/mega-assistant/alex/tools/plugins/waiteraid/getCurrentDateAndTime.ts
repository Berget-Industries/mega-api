import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";
import { DynamicTool, StructuredTool } from "npm:langchain@^0.0.159/tools";
import CallbackHandler from "../../../../../callbackHandler.ts";
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

export const getCurrentDateAndTimeTool = ({ tags }: { tags: string[] }): StructuredTool =>
	new DynamicTool({
		verbose: false,
		name: "get-current-date-and-time",
		description: `användbart när du vill veta vad det är för datum idag eller vad klockan är just nu.
    användbart när du behöver förstå vilket datum gästen pratar om.
    till exemple om gästen säger ett datum som andra mars måste du förstå vilket år gästen menar. gästen kan ju inte boka den andra mars förra året.
  `,
		func: runFunction,
		tags,
		callbacks: [new CallbackHandler()],
	});

export default getCurrentDateAndTimeTool;
