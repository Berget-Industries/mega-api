import { ApiKey } from "../models/index.ts";

export default async function systemApiKeyMiddleware(key: string | null): Promise<void> {
	if (!key) {
		return Promise.reject();
	}

	const apiKey = await ApiKey.findOne({ key });
	if (!apiKey) {
		return Promise.reject();
	}

	if (!apiKey.systemKey) {
		return Promise.reject();
	}

	return Promise.resolve();
}
