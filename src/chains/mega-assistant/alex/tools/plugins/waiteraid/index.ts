import editReservationTool from "./editReservationTool.ts";
import deleteReservationTool from "./deleteReservation.ts";
import createReservationTool from "./createReservationTool.ts";
import getAvailableChambreReservationsTool from "./getAvailableChambreReservationsTool.ts";

interface IPluginConfigWaterAid {
	organizationId: string;
	conversationId: string;
	chambre: string | undefined;
	apiKey: string;
}

export default function initPluginWaiterAid(config: IPluginConfigWaterAid, tags: string[]) {
	return [
		editReservationTool({ tags: [...tags, "editReservationTool"], ...config }),
		createReservationTool({ tags: [...tags, "createReservationTool"], ...config }),
		deleteReservationTool({ tags: [...tags, "deleteReservationTool"], ...config }),
		getAvailableChambreReservationsTool({
			tags: [...tags, "getAvailableChambreReservationsTool"],
			...config,
		}),
	];
}
