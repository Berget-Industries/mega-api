import mongoose from "npm:mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function initDatabase() {
	const uri = Deno.env.get("MONGOOSE_CONNECT_URI");
	if (!uri) {
		console.log("Could not find MONGOOSE_CONNECT_URI env.");
		Deno.exit();
	}
	try {
		await mongoose.connect(uri);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log("Database connection error: ", error);
		throw error;
	}
}
