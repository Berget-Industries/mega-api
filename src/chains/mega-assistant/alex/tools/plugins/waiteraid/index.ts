import editReservationTool from "./editReservationTool.ts";
import deleteReservationTool from "./deleteReservation.ts";
import createReservationTool from "./createReservationTool.ts";
import getAvailableChambreReservationsTool from "./getAvailableChambreReservationsTool.ts";

interface IPluginConfigWaterAid {
	chambre: string | undefined;
	apiKey: string;
}

interface initPluginWaiterAidInput {
	config: IPluginConfigWaterAid;
	conversationId: string;
	organizationId: string;
	tags: string[];
}

export default function initPluginWaiterAid({
	config,
	conversationId,
	organizationId,
	tags,
}: initPluginWaiterAidInput) {
	return [
		editReservationTool({
			tags: [...tags, "editReservationTool"],
			...config,
			conversationId,
		}),
		createReservationTool({
			tags: [...tags, "createReservationTool"],
			...config,
			conversationId,
		}),
		deleteReservationTool({ tags: [...tags, "deleteReservationTool"], ...config }),
		getAvailableChambreReservationsTool({
			tags: [...tags, "getAvailableChambreReservationsTool"],
			...config,
		}),
	];
}
