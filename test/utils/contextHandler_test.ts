// Test för response handlers
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import {
	handleResponseSuccess,
	handleResponseError,
	handleResponsePartialContent,
	handleResponseUnauthorized,
} from "../../src/utils/contextHandler.ts"; // Ersätt med sökvägen till din modul

const sandbox = sinon.createSandbox();

Deno.test("response handlers - Handle different response scenarios", () => {
	try {
		let ctx: any = { response: {} };

		// Testfall för handleResponseSuccess
		handleResponseSuccess(ctx, { message: "Success" });
		assertEquals(ctx.response.status, 200);
		assertEquals(ctx.response.body, { message: "Success" });

		// Återställ ctx för nästa test
		ctx = { response: {} };

		// Testfall för handleResponseError
		handleResponseError(ctx, { error: "Error" });
		assertEquals(ctx.response.status, 500);
		assertEquals(ctx.response.body, { error: "Error" });

		// Återställ ctx för nästa test
		ctx = { response: {} };

		// Testfall för handleResponsePartialContent
		handleResponsePartialContent(ctx, { message: "Partial Content" });
		assertEquals(ctx.response.status, 206);
		assertEquals(ctx.response.body, { message: "Partial Content" });

		// Återställ ctx för nästa test
		ctx = { response: {} };

		// Testfall för handleResponseUnauthorized
		handleResponseUnauthorized(ctx, { error: "Unauthorized" });
		assertEquals(ctx.response.status, 401);
		assertEquals(ctx.response.body, { error: "Unauthorized" });
	} finally {
		sandbox.restore();
	}
});
