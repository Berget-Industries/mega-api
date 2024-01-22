import { initDatabase } from "./utils/initDatabase.ts";
import { initOakApp } from "./utils/initOakApp.ts";
import initNewInstance from "./utils/initNewInstance.ts";

async function init() {
	try {
		await initDatabase();
		await initNewInstance();
		initOakApp();
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

init();
