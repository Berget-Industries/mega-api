import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { User } from "../../models/index.ts";
import * as bcrypt from "npm:bcrypt-ts";
import { sign as jwtSign, verify as jwtVerify } from "npm:jsonwebtoken";
import { sessionStore } from "../../utils/sessionStore.ts";

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

router.post("/login", async (ctx: Context) => {
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

		const body = {
			accessToken: token,
			user,
		};
		handleResponseSuccess(ctx, body);
	} catch (error) {
		console.error(error);
		const body = { message: "Internal Server Error" };
		handleResponseError(ctx, body);
	}
});

export default router;
