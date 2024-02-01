import { Worker } from "../models/Worker";

export function handleWorkerSocket(io, socket) {
	socket.on("register-worker", async (data) => {
		console.log("register-worker", data);
		const worker = await Worker.findOne({ socketId: socket.id });
		if (!worker) {
			await Worker.create({ socketId: socket.id });
		}
	});
}
