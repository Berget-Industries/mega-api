import { initDatabase } from "./utils/initDatabase.ts";
import { initOakApp } from "./utils/initOakApp.ts";
import initSocketIo from "./utils/initSocketIo.ts";
import initNewInstance from "./utils/initNewInstance.ts";
import handleShutdown from "./utils/handleShutdown.ts";
import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

const startServer = async (io: Server, app: Application, controller: AbortController) => {
	const handler = io.handler(async (req) => {
		return (await app.handle(req)) || new Response(null, { status: 404 });
	});

	const port = parseInt(Deno.env.get("PORT") || "3001", 10);
	await serve(handler, {
		signal: controller.signal,
		port,
	});
};

async function init() {
	try {
		await initDatabase();
		await initNewInstance();

		const [app, activeRequests] = await initOakApp();
		const io = initSocketIo();
		const controller = handleShutdown(io, activeRequests);

		startServer(io, app, controller);
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

init();
