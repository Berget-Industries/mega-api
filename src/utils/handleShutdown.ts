import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

import { ActiveRequestsCounter } from "./initOakApp.ts";

export default function handleShutdown(io: Server, activeRequestCounter: ActiveRequestsCounter) {
	const controller = new AbortController();

	const handle = async () => {
		console.log("\n\nShutting down...");
		while (activeRequestCounter.get() > 0) {
			await new Promise((resolve) => {
				console.log(
					`Waiting for ${activeRequestCounter.get()} active requests to complete...`
				);
				setTimeout(resolve, 5000);
			});
		}
		console.log("No active requests.");

		io.disconnectSockets(true);
		await new Promise((resolve) => {
			console.log("Waiting for sockets to disconnect...");
			setTimeout(resolve, 3000);
		});

		io.close();
		await new Promise((resolve) => {
			console.log("Waiting for socket.io to close...");
			setTimeout(resolve, 3000);
		});

		controller.abort();
		await new Promise((resolve) => {
			const seconds = 5;
			console.log(`Waiting for ${seconds} seconds...`);
			setTimeout(resolve, 1000 * seconds);
		});

		console.log("Shutdown complete.");
		Deno.exit();
	};

	Deno.addSignalListener("SIGINT", handle);
	Deno.addSignalListener("SIGTERM", handle);

	return controller;
}
