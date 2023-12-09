import mongoose from "npm:mongoose";

export async function initDatabase(uri: string) {
	try {
		await mongoose.connect(uri);
	} catch (error) {
		console.log("Database connection error: ", error);
		throw error;
	}
}
