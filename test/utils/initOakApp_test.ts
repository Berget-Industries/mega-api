// Test för initOakApp funktionen
import * as sinon from "npm:sinon";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { initOakApp } from "../../src/utils/initOakApp.ts";

let sandbox = sinon.createSandbox();

Deno.test("initOakApp - Application startup handling", async () => {
	try {
		// Stubbar Deno.env.get för att returnera en testport
		sandbox.stub(Deno.env, "get").withArgs("PORT").returns("3000");

		// Stubbar Application.listen
		const listenStub = sandbox.stub(Application.prototype, "listen").resolves();

		// Startar initOakApp och hanterar AbortController
		const controller = await initOakApp();
		sinon.assert.calledOnce(listenStub);
		sinon.assert.calledWithMatch(listenStub, { port: 3000 });

		// Avbryter och stänger servern
		controller.abort();
	} finally {
		// Återställer stubbarna
		sandbox.restore();
	}
});
