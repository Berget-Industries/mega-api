import * as sinon from "npm:sinon";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import SessionStore from "../../src/utils/sessionStore.ts"; // Justera sökvägen efter behov
import Session from "../../src/models/Session.ts"; // Justera sökvägen efter behov
import { Types } from "npm:mongoose";

const sandbox = sinon.createSandbox();

Deno.test("SessionStore - createSession", async () => {
	// Setup stubs
	const mockSession = {
		_id: new Types.ObjectId(),
		user: new Types.ObjectId(),
		token: "mockToken",
		expiry: 123456789,
		populate: sandbox.stub().returnsThis(),
		exec: sandbox.stub().resolves({
			user: { username: "mockUser", email: "mock@example.com" },
		}),
		save: sandbox.stub().resolves(),
	};
	sandbox.stub(Session, "create").resolves(mockSession);
	sandbox.stub(Session, "findById").resolves(mockSession);

	// Test createSession
	const sessionStore = SessionStore;
	const result = await sessionStore.createSession(new Types.ObjectId(), "mockToken", 123456789);

	assertEquals(result.token, "mockToken");
	assertEquals(result.user.name, "mockUser");
	// ... andra assertions ...

	sandbox.restore();
});

Deno.test("SessionStore - getSession", async () => {
	try {
		// Skapa en mockad session
		const mockSession = {
			token: "mockToken",
			user: new Types.ObjectId(),
			populate: sandbox.stub().returnsThis(),
			exec: sandbox.stub().resolves({
				user: { username: "mockUser", email: "mock@example.com" },
			}),
		};
		sandbox.stub(Session, "findOne").returns(mockSession);

		// Testa getSession
		const result = await SessionStore.getSession("mockToken");

		assertEquals(result.token, "mockToken");
		assertEquals(result.user.name, "mockUser");
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
