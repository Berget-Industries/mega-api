// Test för Organization.ts
import { assertEquals } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import * as sinon from "npm:sinon";
import Organization from "../../src/models/Organization.ts";
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

Deno.test("Organization Model - Strukturkontroll", async () => {
	try {
		const saveStub = sandbox.stub(Organization.prototype, "save").resolves();

		const testOrganization = new Organization({
			name: "Test Organization",
			logoUrl: "http://example.com/logo.jpg",
			users: [new Types.ObjectId("507f191e810c19729de860ec")],
			conversations: [new Types.ObjectId("507f191e810c19729de860ed")],
			messages: [new Types.ObjectId("507f191e810c19729de860ee")],
			plugins: [],
		});

		await testOrganization.save();
		const organizationObject = testOrganization.toObject();

		assertEquals(typeof organizationObject.name, "string", "name bör vara en sträng");
		assertEquals(typeof organizationObject.logoUrl, "string", "logoUrl bör vara en sträng");
		assertEquals(
			Array.isArray(organizationObject.users),
			true,
			"users bör vara en array av ObjectId"
		);
		assertEquals(Array.isArray(organizationObject.plugins), true, "plugins bör vara en array");

		const allowedFields = [
			"_id",
			"name",
			"logoUrl",
			"users",
			"conversations",
			"messages",
			"plugins",
		];
		Object.keys(organizationObject).forEach((key) => {
			assertEquals(allowedFields.includes(key), true, `Oväntat fält: ${key}`);
		});
	} finally {
		sandbox.restore();
	}
});
