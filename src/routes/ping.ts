import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { handleResponseError, handleResponseSuccess } from "../utils/contextHandler.ts";
import { hostname } from "https://deno.land/std@0.122.0/node/os.ts";
import { networkInterfaces } from "https://deno.land/std@0.122.0/node/os.ts";

const router = new Router();

function getServerInfo() {
	const hostName = hostname();
	const interfaces = networkInterfaces();
	const networkInfo = Object.keys(interfaces).map((interfaceName) => {
		return {
			interfaceName,
			addresses: interfaces[interfaceName]?.map((iface) => iface.address),
		};
	});

	return {
		hostName,
		networkInfo,
	};
}

router.get("/ping", (ctx: Context) => {
	try {
		const serverInfo = getServerInfo();
		handleResponseSuccess(ctx, { status: "success", message: "Online", serverInfo });
	} catch (error) {
		handleResponseError(ctx, { status: "internal-error", message: "An error occurred", error });
	}
});

export default router;
