import createCalendarEvent from "./createCalendarEvent.ts";

interface initPluginGSuite {
	tags: string[];
	config: Record<string, any>;
	conversationId: string;
	organizationId: string;
	pluginId: string;
}

interface initPluginGSuiteCalendarEvent extends initPluginGSuite {
	config: {
		serviceAccountEmail: string;
		privateKey: string;
		calendarId: string;
	};
}

export default function initPluginGSuite({
	tags,
	config,
	conversationId,
	organizationId,
}: initPluginGSuite) {
	return [
		createCalendarEvent({
			config,
			conversationId,
			organizationId,
			tags,
		} as initPluginGSuiteCalendarEvent),
	];
}

export const initPluginGSuiteCalendarEvent = ({
	tags,
	config,
	conversationId,
	organizationId,
	pluginId,
}: initPluginGSuiteCalendarEvent) => [
	createCalendarEvent({ config, conversationId, organizationId, tags }),
];
