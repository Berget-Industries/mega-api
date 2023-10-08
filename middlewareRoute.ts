import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { join } from "https://deno.land/std@0.203.0/path/mod.ts";

interface MiddlewareOptions {
  baseRoute: string;
  directory: string;
  router: Router;
}

export async function loadControllers({
  baseRoute,
  directory,
  router,
}: MiddlewareOptions) {
  const files = [];
  for await (const entry of Deno.readDir(directory)) {
    if (entry.isFile && entry.name.endsWith(".ts")) {
      files.push(entry.name);
    }
  }

  for (const file of files) {
    const controllerModule = await import(`./${join(directory, file)}`);
    if (controllerModule.default) {
      const controller = controllerModule.default;
      if (controller instanceof Router) {
        console.log(`Loaded routes from: ${join(directory, file)}`);
        router.use(`${baseRoute}`, controller.routes());
      }
    }
  }
}
