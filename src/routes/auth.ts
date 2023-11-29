import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
// import bcrypt from "npm:bcrypt";
import { User } from "../models/UserModel.ts";
import * as bcrypt from "npm:bcrypt-ts";

import { sign as jwtSign, verify as jwtVerify } from "npm:jsonwebtoken";
import { sessionStore } from "../utils/sessionStore.ts";

import authenticationMiddleware from "../middleware/authenticationMiddleware.ts";

const router = new Router();

async function validateUser(email: string, password: string): Promise<any> {
	const user = await User.findOne({ email });
	if (!user) {
		return null; // Användaren finns inte
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	console.log(hashedPassword);

	const passwordMatch = await bcrypt.compare(password, user.password);
	console.log(passwordMatch);

	const formatUser = () => {
		let { password, _id, ...rest } = user.toObject();
		let formattedUser = { id: _id, ...rest };
		return formattedUser;
	};

	const res = formatUser();

	return res;
}

router.post("/auth/login", async (ctx: Context) => {
	try {
		const { email, password } = await ctx.request.body().value;
		// Validera användarnamn och lösenord...

		const user = await validateUser(email, password);
		if (!user) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		const token = await jwtSign({ email }, Deno.env.get("JWT_SECRET") || "", {
			expiresIn: "2h",
		});

		// Skapa en session och spara den i session store
		sessionStore.createSession(user, token, Date.now() + 2 * 60 * 60 * 1000);

		ctx.response.status = 200;
		ctx.response.body = {
			accessToken: token,
			user,
		};
	} catch (error) {
		console.error(error);
		ctx.response.status = 500;
		ctx.response.body = { message: "Internal Server Error" };
	}
});

router.get("/auth/me", authenticationMiddleware, async (ctx: Context) => {
	ctx.response.status = 200;
	ctx.response.body = {
		user: ctx.state.session.user,
	};
});

router.post("/auth/logout", async (ctx: Context) => {
	try {
		const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");
		if (token) {
			sessionStore.deleteSession(token);
		}

		ctx.response.status = 200;
		ctx.response.body = { message: "Logged out successfully" };
	} catch (error) {
		ctx.response.status = 500;
		ctx.response.body = { message: "Internal Server Error" };
	}
});

export default router;
