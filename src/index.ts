import { initDatabase } from "./utils/databaseUtil.ts";
import { initOakApp } from "./utils/oakAppUtil.ts";

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
