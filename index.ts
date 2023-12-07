import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Application, Router, Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import routes from "./src/routes/index.ts";

const PORT: string | undefined = Deno.env.get("PORT");
const parsedPORT = PORT ? parseInt(PORT, 10) : null;

async function init() {
	try {
		const mongooseConnect = Deno.env.get("MONGOOSE_CONNECT_URI");

		if (!mongooseConnect) {
			console.log("Could not find MONGOOSE_CONNECT_URI env.");
			Deno.exit();
		}

		console.log("Connecting to database...");
		await initDatabase(mongooseConnect);
		console.log("Connected to database successfully.");

		console.log("Loading Oak...");
		await initOakApp();
		console.log(`Oak loaded successfully on PORT: ${PORT}.`);
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

async function initDatabase(uri: string) {
	try {
		await mongoose.connect(uri);
	} catch (error) {
		console.error("Database connection error:", error);
		throw error;
	}
}

async function initOakApp() {
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

init();
