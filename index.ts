import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { loadControllers } from "./middlewareRoute.ts";
import * as colors from "https://deno.land/std@0.203.0/fmt/colors.ts";
const PORT = 3000;

async function init() {
	try {
		const mongooseConnect = Deno.env.get("MONGOOSE_CONNECT_URI");

		if (!mongooseConnect) {
			console.log("Could not find MONGOOSE_CONNECT_URI env.");
			Deno.exit();
		}

		console.log(colors.yellow("Connecting to database..."));
		await initDatabase(mongooseConnect);
		console.log(colors.green("Connected to database successfully."));

		await initOakApp();
		setTimeout(() => {
			console.log(colors.green(`Oak loaded successfully, PORT: ${PORT}`));
		}, 1000);
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

function initOakApp(): Promise<void> {
	return new Promise<void>((resolve) => {
		const app = new Application();
		const router = new Router();
		const middlewareOptions = {
			baseRoute: "/api",
			directory: "./src/routes",
			router,
		};
		loadControllers(middlewareOptions);
		app.use(router.routes());
		app.use(router.allowedMethods());
		app.listen({ port: PORT });
		resolve();
	});
}

init();
