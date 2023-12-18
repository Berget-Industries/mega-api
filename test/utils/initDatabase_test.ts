// Test för initDatabase funktionen
import * as sinon from "npm:sinon";
import { initDatabase } from "../../src/utils/initDatabase.ts"; // Ersätt med sökvägen till din modul
import mongoose from "npm:mongoose";
import dotenv from "npm:dotenv";

let sandbox = sinon.createSandbox();

Deno.test("initDatabase - Database connection handling", async () => {
	try {
		dotenv.config();

		// Testfall när URI är tillhandahållen
		const uri = "mocked-uri";
		sandbox.stub(Deno.env, "get").withArgs("MONGOOSE_CONNECT_URI").returns(uri);
		const connectStub = sandbox.stub(mongoose, "connect").resolves();

		await initDatabase();
		sinon.assert.calledOnceWithExactly(connectStub, uri);

		// Återställer stubbarna för nästa test
		sandbox.restore();
		sandbox = sinon.createSandbox();

		// Testfall när ingen URI är tillhandahållen
		sandbox.stub(Deno.env, "get").withArgs("MONGOOSE_CONNECT_URI").returns(undefined);
		const exitStub = sandbox.stub(Deno, "exit");

		try {
			await initDatabase();
		} catch (e) {
			// Ignorera fel eftersom vi förväntar oss ett avbrott i exekveringen
		}

		sinon.assert.calledOnce(exitStub);
	} finally {
		sandbox.restore();
	}
});
