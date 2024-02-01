import { Application, Router, Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import routes from "../routes/index.ts";
import dotenv from "npm:dotenv";
dotenv.config();

export class ActiveRequestsCounter {
	private activeRequests = 0;

	public add() {
		this.activeRequests++;
	}

	public remove() {
		this.activeRequests--;
	}

	public get() {
		return this.activeRequests;
	}
}

export function initOakApp(): Promise<[Application, ActiveRequestsCounter]> {
	return new Promise((resolve, reject) => {
		try {
			const app = new Application();
			const router = new Router();

			app.use(oakCors());

			const activeRequestHandler = new ActiveRequestsCounter();
			app.use(async (ctx: Context, next: Next) => {
				activeRequestHandler.add();
				await next();
				activeRequestHandler.remove();
			});

			router.use("/api", routes.routes());
			router.use("/api", routes.allowedMethods());

			app.use(router.routes());
			app.use(router.allowedMethods());

			console.log("Oak app initialized.");

			resolve([app, activeRequestHandler]);
		} catch (error) {
			reject(error);
		}
	});
}
