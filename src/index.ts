import { initDatabase } from "./utils/initDatabase.ts";
import { initOakApp } from "./utils/initOakApp.ts";

async function init() {
	try {
		await initDatabase();

		initOakApp();
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

init();
