import { Session } from "../models/index.ts";
import { Types } from "npm:mongoose";
import { IUser } from "../models/User.ts";

class SessionStore {
	async createSession(user: Types.ObjectId, token: string, expiry: number) {
		const session = await Session.create({ user, token, expiry });
		await session.save();

		const sessionWithUser = await Session.findById(session._id)
			.populate({
				path: "user",
				select: "-password",
			})
			.exec();

		return {
			...sessionWithUser,
			user: sessionWithUser?.user as IUser,
		};
	}

	async getSession(token: string) {
		const session = await Session.findOne({ token })
			.populate({
				path: "user",
				select: "-password",
			})
			.exec();

		return {
			...session,
			user: session?.user as IUser,
		};
	}

	async deleteSession(token: string) {
		await Session.deleteOne({ token }).exec();
	}
}

export default new SessionStore();
