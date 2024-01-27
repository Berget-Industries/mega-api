import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { handleSocket } from "../websockets/index.ts";

export default function initSocketIo() {
	const io = new Server({
		path: "/api/ws/",
	});

	io.on("connection", (socket) => {
		console.log(`New connection: ${socket.id}`);
		handleSocket(io, socket);
	});

	return io;
}
