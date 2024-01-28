import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import systemApiKeyWebsocketMiddleware from "../middleware/systemApiKeyWebsocketMiddleware.ts";
import { handleSocket } from "../websockets/index.ts";

export default function initSocketIo() {
	const io = new Server({
		path: "/api/ws/",
		cors: {
			origin: ["*"],
			allowedHeaders: ["Authorization"],
			credentials: true,
		},
	});

	io.use(systemApiKeyWebsocketMiddleware);

	io.on("connection", async (socket) => {
		console.log(`New connection: ${socket.id}`);
		handleSocket(io, socket);
	});

	return io;
}
