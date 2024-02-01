// Test för initOakApp funktionen
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { initOakApp, ActiveRequestsCounter } from "../../src/utils/initOakApp.ts";
import { assertEquals, assert } from "https://deno.land/std@0.211.0/testing/asserts.ts";

Deno.test("initOakApp", async () => {
	const [app, activeRequestHandler] = await initOakApp();

	assert(app instanceof Application);
	assert(activeRequestHandler instanceof ActiveRequestsCounter);
});
