import { ApiKey } from "../models/index.ts";
import { Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

export default async function systemApiKeyMiddleware(socket: Socket): Promise<void> {
	const key = socket.handshake.auth.token;

	if (!key) {
		return Promise.reject({
			status: "error",
			message: "No API key provided",
		});
	}

	const apiKey = await ApiKey.findOne({ key });
	if (!apiKey) {
		return Promise.reject({
			status: "error",
			message: "Invalid API key",
		});
	}

	if (!apiKey.systemKey) {
		return Promise.reject({
			status: "error",
			message: "Invalid",
		});
	}

	return Promise.resolve();
}
