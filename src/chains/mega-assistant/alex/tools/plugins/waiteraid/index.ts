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
	return {
		waiterAidEditReservation: editReservationTool({ tags, ...config }),
		waiterAidCreateReservation: createReservationTool({ tags, ...config }),
		waiterAidDeleteReservation: deleteReservationTool({ tags, ...config }),
		waiterAidGetAvailableChambreReservations: getAvailableChambreReservationsTool({
			tags,
			...config,
		}),
	};
}
