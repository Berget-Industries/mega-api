import { Context } from "https://deno.land/x/oak/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import aiAuthenticationMiddleware from "../../src/middleware/aiAuthenticationMiddleware.ts";
import { AiAccessKey } from "../../src/models/index.ts";

// Skapa en sinon sandbox
const sandbox = sinon.createSandbox();

function createMockContext(key: string | null): Context {
	return {
		request: {
			headers: new Headers(key ? { AiAuthorization: key } : {}),
		},
		response: {
			status: 0,
			body: {},
		},
		state: {},
	} as any as Context;
}

Deno.test("Ai Authentication Middleware - Valid Access Key", async () => {
	sandbox.stub(AiAccessKey, "findOne").resolves({ organization: "Test Organization" });

	const ctx = createMockContext("valid_key");
	await aiAuthenticationMiddleware(ctx, () => Promise.resolve());

	assertEquals(ctx.response.status, 0);
	assertEquals(ctx.state.organization, "Test Organization");

	sandbox.restore();
});

Deno.test("Ai Authentication Middleware - Invalid Access Key", async () => {
	sandbox.stub(AiAccessKey, "findOne").resolves(null);

	const ctx = createMockContext("invalid_key");
	await aiAuthenticationMiddleware(ctx, () => Promise.resolve());

	assertEquals(ctx.response.status, 401);
	assertEquals(ctx.response.body, { message: "Unauthorized" });

	sandbox.restore();
});

Deno.test("Ai Authentication Middleware - Exception Handling", async () => {
	const findOneStub = sandbox.stub(AiAccessKey, "findOne").throws(new Error("Database error"));

	const ctx = createMockContext("valid_key");
	await aiAuthenticationMiddleware(ctx, () => Promise.resolve());

	assertEquals(ctx.response.status, 401);
	assertEquals(ctx.response.body, { message: "Invalid key!" });

	findOneStub.restore();
});

// Återställa ändringar efter alla tester
sandbox.restore();
