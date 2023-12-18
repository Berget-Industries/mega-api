// Test för uuidv4 funktionen
import { assertMatch } from "https://deno.land/std/testing/asserts.ts";
import uuidv4 from "../../src/utils/generateAccessToken.ts"; // Ersätt med sökvägen till din modul

Deno.test("uuidv4 generates a valid UUID", () => {
	const uuid = uuidv4();

	// Reguljärt uttryck för att matcha UUID v4 formatet
	const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
	assertMatch(uuid, uuidV4Regex, "Genererad UUID bör matcha UUID v4 formatet");
});
