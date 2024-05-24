import { OpenAIEmbeddings } from "npm:langchain@^0.0.159/embeddings/openai";
import { Schema, model } from "npm:mongoose";

type EmbeddedDocument = {
	embedding: number[];
	text: string;
};

export default async function uploadDocument(data: string, collection: string) {
	try {
		const dataSplitStr = "=== SPLIT";
		const splitData = data.split(dataSplitStr);

		const embeddings = new OpenAIEmbeddings();
		const embeddedDocuments: EmbeddedDocument[] = [];

		for (const rawText of splitData) {
			const text = rawText.trim();

			const embedding = await embeddings.embedQuery(text);
			embeddedDocuments.push({
				embedding,
				text,
			});
		}

		const schema = new Schema<EmbeddedDocument>(
			{
				embedding: { type: Array, required: true },
				text: { type: String, required: true },
			},
			{ collection }
		);

		const Model = model(collection, schema);

		await Model.insertMany(embeddedDocuments);

		return Promise.resolve();
	} catch (error) {
		console.error(error);
		return Promise.reject();
	}
}
