import AvailableDate from "./src/models/AvailableDates.ts";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
	const uri = Deno.env.get("MONGOOSE_CONNECT_URI");

	if (!uri) {
		console.log("Could not find MONGOOSE_CONNECT_URI env.");
		Deno.exit();
	}

	console.log("Connecting to database...");
	await mongoose.connect(uri);
	console.log("Connected to database successfully.");

	const data2 = [...Array(365 * 2)].map((x, i) => {
		const date = new Date();
		date.setDate(date.getDate() + i);
		const randomOne = Math.random() >= 0.5;
		const randomTwo = Math.random() >= 0.5;
		return {
			date: date,
			lunch: { isAvailable: randomOne },
			dinner: { isAvailable: randomTwo },
		};
	});

	for (const dateToAdd of data2) {
		const parsedData = {
			...dateToAdd,
			date: new Date(dateToAdd.date),
		};
		const newDoc = await AvailableDate.create(parsedData);
		console.log("Added document", newDoc);
	}

	console.log("All documents upploaded!");
} catch (error) {
	console.error(error);
	Deno.exit();
}
