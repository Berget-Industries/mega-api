import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import mongoose from "npm:mongoose";
import { LoggerCallbackHandler } from "../../../callbackHandlers/index.ts";
import { OpenAIEmbeddings } from "npm:langchain@^0.0.159/embeddings/openai";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain@^0.0.159/tools";
import { MongoDBAtlasVectorSearch } from "npm:langchain@^0.0.159/vectorstores/mongodb_atlas";
import { CallbackManagerForToolRun } from "npm:langchain@^0.0.159/callbacks";

export type knowledgeToolInput = {
	query: string;
	document: string;
};

export const knowledgeToolInputZod = z.object({
	query: z.string().describe("Frågan du vill få svar på."),
	document: z
		.enum(["Trattorian_Hemsida", "Trattorian_Meny"])
		.describe("Välj vilket document du vill söka i."),
});

const runFunction = async (
	{ query, document }: knowledgeToolInput,
	_runManager: CallbackManagerForToolRun | undefined
) => {
	const dbModel = mongoose.model(document);
	const collection = dbModel.collection;

	const embeddings = new OpenAIEmbeddings();
	const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
		embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
		indexName: document, // The name of the Atlas search index. Defaults to "default"
		textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
		collection,
	});

	const result = await vectorStore.similaritySearch(query, 1);
	const returnValue = result.map((x) => x.pageContent);

	return Promise.resolve(returnValue.join("\n"));
};

export default function knowledgeTool({ tags }: { tags: string[] }): StructuredTool {
	return new DynamicStructuredTool({
		verbose: false,
		schema: knowledgeToolInputZod,
		name: "trattorian-knowledge",
		description:
			"användbart när du behöver veta något om trattorian. Här finns all din kunskap om trattorian",
		func: runFunction,
		callbacks: [new LoggerCallbackHandler()],
		tags,
	});
}
