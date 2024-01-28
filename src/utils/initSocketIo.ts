import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import systemApiKeyWebsocketMiddleware from "../middleware/systemApiKeyWebsocketMiddleware.ts";
import { handleSocket } from "../websockets/index.ts";

export default function initSocketIo() {
	const io = new Server({
		path: "/api/ws/",
		allowRequest: async (req) => {
			try {
				const token = req.headers.get("Authorization");
				await systemApiKeyWebsocketMiddleware(token);
				return Promise.resolve();
			} catch (error) {
				return Promise.reject("Unauthorized");
			}
		},
	});

	io.on("connection", (socket) => {
		console.log(`New connection: ${socket.id}`);
		handleSocket(io, socket);
	});

	return io;
}
