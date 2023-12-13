import { initDatabase } from "./utils/initDatabase.ts";
import { initOakApp } from "./utils/initOakApp.ts";

async function init() {
	try {
		console.log("Connecting to database...");
		await initDatabase();

		console.log("Loading Oak...");
		initOakApp();
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

init();
