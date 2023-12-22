import * as sinon from "npm:sinon";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import SessionStore from "../../src/utils/sessionStore.ts"; // Justera sökvägen efter behov
import Session from "../../src/models/Session.ts"; // Justera sökvägen efter behov
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

const mockSession = {
	_id: new Types.ObjectId(),
	user: new Types.ObjectId(),
	token: "mockToken",
	expiry: 123456789,
	exec: sandbox.stub().resolves({
		user: { name: "mockUser", email: "mock@example.com" },
	}),
	save: sandbox.stub().resolves(),
	// Add a mock populate method that returns an object with exec
	populate: sandbox.stub().returns({
		exec: sandbox.stub().resolves({
			user: { name: "mockUser", email: "mock@example.com" },
		}),
	}),
};

Deno.test("SessionStore - createSession", async () => {
	// Setup stubs

	sandbox.stub(Session, "create").resolves(mockSession);
	sandbox.stub(Session, "findById").returns(mockSession);

	// Test createSession
	const sessionStore = SessionStore;
	const result = await sessionStore.createSession(new Types.ObjectId(), "mockToken", 123456789);
	console.log(result);

	assertEquals(result.user.name, "mockUser");
	assertEquals(result.user.email, "mock@example.com");
	// ... andra assertions ...

	sandbox.restore();
});

Deno.test("SessionStore - getSession", async () => {
	try {
		sandbox.stub(Session, "findOne").returns(mockSession);

		// Testa getSession
		const result = await SessionStore.getSession("mockToken");
		console.log(result);

		assertEquals(result.user.name, "mockUser");
		assertEquals(result.user.email, "mock@example.com");
	} finally {
		sandbox.restore();
	}
});

Deno.test("SessionStore - deleteSession", async () => {
	try {
		// Stubba Session.deleteOne
		const deleteOneStub = sandbox.stub(Session, "deleteOne").returns({
			exec: sandbox.stub().resolves({ deletedCount: 1 }),
		});

		// Testa deleteSession
		await SessionStore.deleteSession("mockToken");

		sinon.assert.calledOnceWithExactly(deleteOneStub, { token: "mockToken" });
	} finally {
		sandbox.restore();
	}
});

// Liknande testfall för getSession och deleteSession
