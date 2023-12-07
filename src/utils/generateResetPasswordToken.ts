import { sign as jwtSign } from "npm:jsonwebtoken";

export default (email: string) =>
	jwtSign({ email, type: "reset-password" }, Deno.env.get("JWT_SECRET") || "", {
		expiresIn: "1h",
	});
