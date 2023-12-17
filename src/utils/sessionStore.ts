import { Session } from "../models/index.ts";
import { Types } from "npm:mongoose";

export const createSession = async (user: Types.ObjectId, token: string, expiry: number) => {
	const session = await Session.create({ user, token, expiry });
	await session.save();

	const sessionWithUser = await Session.findById(session._id)
		.populate({
			path: "user",
			select: "-password",
		})
		.exec();

	return sessionWithUser;
};

export const getSession = async (token: string) => {
	return await Session.findOne({ token })
		.populate({
			path: "user",
			select: "-password",
		})
		.exec();
};

export const deleteSession = async (token: string) => {
	await Session.deleteOne({ token }).exec();
};
