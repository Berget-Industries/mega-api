import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import routes from "../routes/index.ts";
import dotenv from "dotenv";
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

	router.use("/api", routes.routes());
	router.use("/api", routes.allowedMethods());

	app.use(router.routes());
	app.use(router.allowedMethods());

	app.listen({ port: parsedPORT });
	console.log(`Oak loaded successfully on PORT: ${PORT}`);
}
