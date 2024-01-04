// Test för JWT-funktioner
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as sinon from "npm:sinon";
import { createJwtToken, verify, getJwtSecret } from "../../src/utils/jwt.ts"; // Ersätt med sökvägen till din modul

const sandbox = sinon.createSandbox();

Deno.test("JWT functions - Token creation and verification", async () => {
	try {
		// Stubba JWT_SECRET
		const fakeSecret = "fake-secret";
		sandbox.stub(Deno.env, "get").withArgs("JWT_SECRET").returns(btoa(fakeSecret));

		// Testfall för att skapa en JWT
		const token = await createJwtToken({ data: "test" });
		assertEquals(typeof token, "string", "Token ska vara en sträng");

		// Testfall för att verifiera en JWT
		const payload = await verify(token);
		assertEquals(payload.data, "test", "Payload ska innehålla korrekt data");
	} finally {
		sandbox.restore();
	}
});
