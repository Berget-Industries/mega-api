import * as bcrypt from "npm:bcrypt-ts";
import { User } from "../../models/index.ts";
import { sessionStore } from "../../utils/sessionStore.ts";
import { createJwtToken } from "../../utils/jwt.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";

const router = new Router();

async function validateUser(email: string, password: string): Promise<any> {
	const user = await User.findOne({ email });
	if (!user) {
		return null; // Användaren finns inte
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const passwordMatch = await bcrypt.compare(password, user.password);
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
		const user = await validateUser(email, password);

		if (!user) {
			ctx.response.status = 401;
			ctx.response.body = { message: "Unauthorized" };
			return;
		}

		const token = await createJwtToken({ email });
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
