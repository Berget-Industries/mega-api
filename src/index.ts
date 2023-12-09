import dotenv from "dotenv";
dotenv.config();
import { initDatabase } from "./utils/databaseUtil.ts";
import { initOakApp } from "./utils/oakAppUtil.ts";

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
		initOakApp(parsedPORT);
		console.log(`Oak loaded successfully on PORT: ${PORT}.`);
	} catch (error) {
		console.log("error", error);
		Deno.exit();
	}
}

init();
