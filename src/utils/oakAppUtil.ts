import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import routes from "../routes/index.ts";

export function initOakApp(parsedPORT: number | null) {
	const app = new Application();
	const router = new Router();

	router.use("/api", routes.routes());
	router.use("/api", routes.allowedMethods());

	app.use(router.routes());
	app.use(router.allowedMethods());

	if (parsedPORT) {
		app.listen({ port: parsedPORT });
	} else {
		console.error("PORT är antingen inte satt eller inte ett giltigt heltal.");
		Deno.exit();
	}
}
