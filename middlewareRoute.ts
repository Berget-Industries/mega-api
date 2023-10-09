import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { join } from "https://deno.land/std@0.203.0/path/mod.ts";
import * as colors from "https://deno.land/std@0.203.0/fmt/colors.ts";

interface MiddlewareOptions {
	baseRoute: string;
	directory: string;
	router: Router;
}

export async function loadControllers({ baseRoute, directory, router }: MiddlewareOptions) {
	const files = [];
	for await (const entry of Deno.readDir(directory)) {
		if (entry.isFile && entry.name.endsWith(".ts")) {
			files.push(entry.name);
		}
	}

	const routerName = colors.gray("[ROUTER]: ");
	console.log(routerName + colors.yellow("Loading Oak Router..."));
	const loadedFiles: string[] = [];

	for (const file of files) {
		try {
			const controllerModule = await import(`./${join(directory, file)}`);
			if (controllerModule.default) {
				const controller = controllerModule.default;
				if (controller instanceof Router) {
					const text = colors.green(
						`Successfully Loaded routes from: ${join(directory, file)}`
					);
					console.log(routerName + text);
					router.use(`${baseRoute}`, controller.routes());
					loadedFiles.push(file);
				}
			}
		} catch (error) {
			const errorMessage = colors.red(
				`Could not load: ${join(directory, file)} - ${error.message}`
			);
			console.error(routerName + errorMessage);
		}
	}

	const unlinkedFiles = files.filter((file) => !loadedFiles.includes(file));
	if (unlinkedFiles.length > 0) {
		for (const unlinkedFile of unlinkedFiles) {
			const unlinkedMessage = colors.red(`Could not load: ${unlinkedFile}`);
			console.error(routerName + unlinkedMessage);
		}
	}
}
