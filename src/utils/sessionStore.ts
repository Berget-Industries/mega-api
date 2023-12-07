interface Session {
	user: any;
	token: string;
	expiry: number;
}

class SessionStore {
	private sessions: Map<string, Session> = new Map();

	createSession(user: any, token: string, expiry: number) {
		this.sessions.set(token, { user, token, expiry });
	}

	getSession(token: string): Session | undefined {
		return this.sessions.get(token);
	}

	deleteSession(token: string) {
		this.sessions.delete(token);
	}
}

const sessionStore = new SessionStore();
export { sessionStore };
