import { z } from "npm:zod";
import mongoose from "npm:mongoose";
import { LoggerCallbackHandler } from "../../../callbackHandlers/index.ts";
import { OpenAIEmbeddings } from "npm:langchain/embeddings/openai";
import { DynamicStructuredTool, StructuredTool } from "npm:langchain/tools";
import { MongoDBAtlasVectorSearch } from "npm:@langchain/mongodb";
import { Collection, Document } from "npm:mongodb";
import { PluginStat_KnowledgeTool } from "../../../../models/index.ts";

export const knowledgeToolInputZod = z.object({
	query: z.string().describe("Frågan du vill få svar på."),
});

export interface KnowledgeToolConfig {
	collection: string;
}

const runFunction = async (
	{ query }: z.infer<typeof knowledgeToolInputZod>,
	config: KnowledgeToolConfig,
	organizationId: string,
	conversationId: string,
	pluginId: string
) => {
	const dataSchema = new mongoose.Schema(
		{
			text: String,
			embedding: Array,
		},
		{ collection: config.collection }
	);

	const dbModel = mongoose.model(config.collection, dataSchema);
	const collection = dbModel.collection as unknown as Collection<Document>;

	const embeddings = new OpenAIEmbeddings();
	const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
		embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
		indexName: config.collection, // The name of the Atlas search index. Defaults to "default"
		textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
		collection,
	});

	const result = await vectorStore.similaritySearch(query, 3);

	const returnValue = result.map((x) => x.pageContent);

	await PluginStat_KnowledgeTool.create({
		query,
		result: returnValue,
		organizationId,
		conversationId,
		pluginId,
	});

	return Promise.resolve(returnValue.join("\n"));
};

export function knowledgeTool({
	tags,
	config,
	organizationId,
	conversationId,
	pluginId,
}: {
	tags: string[];
	config: KnowledgeToolConfig;
	conversationId: string;
	organizationId: string;
	pluginId: string;
}): StructuredTool {
	return new DynamicStructuredTool({
		verbose: true,
		schema: knowledgeToolInputZod,
		name: "min-kunskap",
		description: "användbart när du behöver svar på en fråga som du inte vet svaret på.",
		func: (input) => runFunction(input, config, organizationId, conversationId, pluginId),
		callbacks: [new LoggerCallbackHandler()],
		tags,
	});
}

export interface InitPluginKnowledge {
	tags: string[];
	config: KnowledgeToolConfig;

	conversationId: string;
	organizationId: string;
	pluginId: string;
}

export const initPluginKnowledge = ({
	tags,
	config,
	organizationId,
	conversationId,
	pluginId,
}: InitPluginKnowledge) => [
	knowledgeTool({ tags, config, organizationId, conversationId, pluginId }),
];
