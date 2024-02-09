import * as bcrypt from "npm:bcrypt-ts";
import { User, Organization } from "../../models/index.ts";
import sessionStore from "../../utils/sessionStore.ts";
import { createJwtToken } from "../../utils/jwt.ts";
import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
	handleResponseError,
	handleResponseSuccess,
	handleResponseUnauthorized,
} from "../../utils/contextHandler.ts";

const router = new Router();

async function validateUser(email: string, password: string): Promise<any> {
	const user = await User.findOne({ email }).populate({
		path: "organizations",
		select: "-users -__v",
	});
	if (!user) {
		return null;
	}

	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return null;
	}

	const formatUser = () => {
		const { password, _id, ...rest } = user.toObject();
		const formattedUser = { id: _id, ...rest };
		return formattedUser;
	};

	if (user.systemAdmin) {
		const allOrganizations = await Organization.find({});
		const organizations = allOrganizations.map((_) => _.toObject());
		const formattedUser = { ...formatUser(), organizations };
		return formattedUser;
	}

	return formatUser();
}

router.post("/login", async (ctx: Context) => {
	try {
		const { email, password } = await ctx.request.body().value;
		const user = await validateUser(email, password);

		if (!user) {
			handleResponseUnauthorized(ctx, {
				status: "error",
				message: "Fel användarnamn eller lösenord.",
			});
			return;
		}

		const token = await createJwtToken({ email });
		await sessionStore.createSession(user.id, token, Date.now() + 2 * 60 * 60 * 1000);

		handleResponseSuccess(ctx, {
			status: "success",
			message: "Inloggningen lyckades.",
			accessToken: token,
			user: user,
		});
	} catch (error) {
		console.error(error);
		handleResponseError(ctx, {
			status: "internal-error",
			message: "Ett internt fel har uppstått.",
		});
	}
});

export default router;
