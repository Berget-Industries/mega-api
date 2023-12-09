import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import systemAdminAuthenticationMiddleware from "../../src/middleware/systemAdminAuthenticationMiddleware.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

Deno.test("SystemAdmin Authentication Middleware - Allows system admin", async () => {
	const mockContext = {
		state: {
			session: {
				user: {
					systemAdmin: true,
				},
			},
		},
		response: {
			status: 0,
			body: "",
		},
	} as unknown as Context;

	const next = () => Promise.resolve();

	await systemAdminAuthenticationMiddleware(mockContext, next);

	assertEquals(mockContext.response.status, 0);
});

Deno.test("SystemAdmin Authentication Middleware - Blocks non-system admin", async () => {
	const mockContext = {
		state: {
			session: {
				user: {
					systemAdmin: false,
				},
			},
		},
		response: {
			status: 0,
			body: "",
		},
	} as unknown as Context;

	const next = () => Promise.resolve();

	await systemAdminAuthenticationMiddleware(mockContext, next);

	assertEquals(mockContext.response.status, 401);
	assertEquals(mockContext.response.body, "unauthorized");
});
