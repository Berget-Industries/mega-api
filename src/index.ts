import { initDatabase } from "./utils/databaseUtil.ts";
import { initOakApp } from "./utils/oakAppUtil.ts";

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
