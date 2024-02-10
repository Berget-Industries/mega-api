import { Organization, User, Worker } from "../models/index.ts";

export default async function initNewInstance() {
	try {
		// Check if Organization or Users exists.
		console.log("Checking if database is empty...");
		const orgs = await Organization.find({});
		const users = await User.find({});

		if (orgs.length > 0 || users.length > 0) {
			console.log("Database is not empty.");

			console.log("Cleaning database...");
			await Worker.deleteMany({});

			return;
		}

		console.log("Database is empty, creating deafault User & Organization.");

		// Create default User;
		const defaultUser = await User.create({
			password: "$2a$10$cYbQg4kscBkVXQyJnkGWPeoJG28Hnyb4Vr2NeeKlbTbMDTR2QY0tu", // olle
			name: "Mega Motherfucking G",
			email: "wille@berget.industries",
			organizations: [],
			systemAdmin: true,
		});

		// Create default Organization with default User.
		const defaultOrganization = await Organization.create({
			name: "Mega Organization",
			logourl: "",
			users: [defaultUser._id],
			conversations: [],
			messages: [],
			plugins: [],
		});

		// Add default Organization to User.
		defaultUser.organizations.push(defaultOrganization._id);
		await defaultUser.save();

		return;
	} catch (error) {
		console.error(error);
		throw new Error("Kunde inte skapa default state för ny instans.");
	}
}
