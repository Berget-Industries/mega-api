import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import authenticationMiddleware from "../../src/middleware/authenticationMiddleware.ts";
import sessionStore from "../../src/utils/sessionStore.ts";
import { createJwtToken } from "../../src/utils/jwt.ts";

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

Deno.test("User Authentication Middleware - No Token", async () => {
	const ctx = createMockContext(null);
	await authenticationMiddleware(ctx, () => Promise.resolve());

	assertEquals(ctx.response.status, 401);
	assertEquals(ctx.response.body, { message: "Unauthorized" });
});

Deno.test("User Authentication Middleware - Valid Token", async () => {
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

Deno.test("User Authentication Middleware - Invalid Token", async () => {
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
