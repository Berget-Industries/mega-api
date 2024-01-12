import * as jwt from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import dotenv from "npm:dotenv";
dotenv.config();

export async function getJwtSecret() {
	const jwtSecretBase64 = Deno.env.get("JWT_SECRET");
	if (!jwtSecretBase64) {
		throw "JWT_SECRET not set!";
	}
	const jwtSecretArrayBuffer = atob(jwtSecretBase64)
		.split("")
		.map((c) => c.charCodeAt(0));
	const jwtSecretUint8Array = new Uint8Array(jwtSecretArrayBuffer);

	const jwtSecretKey = await crypto.subtle.importKey(
		"raw",
		jwtSecretUint8Array,
		{ name: "HMAC", hash: { name: "SHA-256" } },
		false,
		["sign", "verify"]
	);

	return jwtSecretKey;
}

export async function createJwtToken(data: object) {
	const jwtSecretKey = await getJwtSecret();
	const header = {
		alg: "HS256",
	} as jwt.Header;
	const payload = {
		...data,
		exp: jwt.getNumericDate(60 * 60),
	} as jwt.Payload;

	return await jwt.create(header, payload, jwtSecretKey);
}

export async function verify(token: string) {
	const jwtSecretKey = await getJwtSecret();
	const payload = jwt.verify(token, jwtSecretKey);

	return payload;
}
