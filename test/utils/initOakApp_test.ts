// Test för initOakApp funktionen
import * as sinon from "npm:sinon";
import { initOakApp } from "../../src/utils/initOakApp.ts"; // Ersätt med sökvägen till din modul
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

let sandbox = sinon.createSandbox();

Deno.test("initOakApp - Application startup handling", async () => {
	try {
		// Testfall när en giltig port tillhandahålls
		const validPort = "3000";
		sandbox.stub(Deno.env, "get").withArgs("PORT").returns(validPort);
		const listenStub = sandbox.stub(Application.prototype, "listen").resolves();

		await initOakApp();
		sinon.assert.calledOnce(listenStub);
		sinon.assert.calledWithMatch(listenStub, { port: 3000 });

		// Återställer stubbarna för nästa test
		sandbox.restore();
		sandbox = sinon.createSandbox();

		// Testfall när ingen giltig port tillhandahålls
		sandbox.stub(Deno.env, "get").withArgs("PORT").returns(undefined);
		const exitStub = sandbox.stub(Deno, "exit");

		try {
			await initOakApp();
		} catch (e) {
			// Ignorera fel eftersom vi förväntar oss ett avbrott i exekveringen
		}

		sinon.assert.calledOnce(exitStub);
	} finally {
		sandbox.restore();
	}
});
