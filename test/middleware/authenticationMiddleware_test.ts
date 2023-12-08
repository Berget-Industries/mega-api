import { Context } from "https://deno.land/x/oak/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import authenticationMiddleware from "../../src/middleware/authenticationMiddleware.ts";
import { sessionStore } from "../../src/utils/sessionStore.ts";
import * as jwt from "https://deno.land/x/djwt/mod.ts";

// Hjälpfunktion för att skapa JWT-token
async function createJwtToken(payload: jwt.Payload) {
	const jwtSecretBase64 = Deno.env.get("JWT_SECRET");
	if (!jwtSecretBase64) return "";

	const jwtSecretArrayBuffer = atob(jwtSecretBase64)
		.split("")
		.map((c) => c.charCodeAt(0));
	const jwtSecretUint8Array = new Uint8Array(jwtSecretArrayBuffer);

	// Importera som en CryptoKey
	const jwtSecretKey = await crypto.subtle.importKey(
		"raw",
		jwtSecretUint8Array,
		{ name: "HMAC", hash: { name: "SHA-256" } },
		false,
		["verify"]
	);
	const header = {
		alg: "HS256",
	} as jwt.Header;

	payload = {
		...payload,
		exp: jwt.getNumericDate(60 * 60), // Sätter token att utgå om en timme
	} as jwt.Payload;

	return await jwt.create(header, payload, jwtSecretKey);
}

// Skapa en sinon sandbox
const sandbox = sinon.createSandbox();

function createMockContext(authorization: string | null): Context {
	return {
		request: {
			headers: new Headers(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
		},
		response: {
			status: 0,
			body: {},
		},
		state: {},
	} as any as Context;
}

Deno.test("Authentication Middleware - No Token", async () => {
	const ctx = createMockContext(null);
	await authenticationMiddleware(ctx, () => Promise.resolve());

	assertEquals(ctx.response.status, 401);
	assertEquals(ctx.response.body, { message: "Unauthorized" });
});

Deno.test("Authentication Middleware - Valid Token", async () => {
	const payload = { email: "user@example.com" };
	const token = await createJwtToken(payload);

	sinon.stub(sessionStore, "getSession").returns({ user: payload });

	const ctx = createMockContext(token);
	await authenticationMiddleware(ctx, () => {
		assertEquals(ctx.state.session, { user: { email: "user@example.com" } });
		return Promise.resolve();
	});

	sandbox.restore();
});

Deno.test("Authentication Middleware - Invalid Token", async () => {
	const token = "invalid_token";
	const ctx = createMockContext(token);
	await authenticationMiddleware(ctx, () => {
		assertEquals(ctx.response.status, 401);
		assertEquals(ctx.response.body, { message: "Invalid or expired token" });
		return Promise.resolve();
	});

	sandbox.restore();
});

// Återställa ändringar efter alla tester
sandbox.restore();
