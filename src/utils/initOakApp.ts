import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import routes from "../routes/index.ts";
import dotenv from "npm:dotenv";
dotenv.config();

export function initOakApp() {
	const PORT = Deno.env.get("PORT");
	const parsedPORT = PORT ? parseInt(PORT, 10) : null;
	if (!parsedPORT) {
		console.log("PORT är antingen inte satt eller inte ett giltigt heltal.");
		Deno.exit();
	}

	const app = new Application();
	const router = new Router();

	app.use(oakCors());

	router.use("/api", routes.routes());
	router.use("/api", routes.allowedMethods());

	app.use(router.routes());
	app.use(router.allowedMethods());

	const controller = new AbortController();
	const { signal } = controller;

	console.log("Loading Oak...");
	app.listen({ port: parsedPORT, signal });
	console.log(`Oak loaded successfully on PORT: ${PORT}`);

	return controller;
}
