import mongoose from "npm:mongoose";
import authenticationMiddleware from "../../middleware/authenticationMiddleware.ts";
import checkOrganizationAccess from "../../middleware/checkOrganizationAccess.ts";
import { Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PluginStat_MailE_SendMailToHuman, PluginStat_KnowledgeTool } from "../../models/index.ts";
import { handleResponseError, handleResponseSuccess } from "../../utils/contextHandler.ts";
import { getAlexPlugins } from "../../utils/getPluginConfig.ts";

const router = new Router();

const generateDateRange = (startDate: Date, endDate: Date) => {
	const dates = [];
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		dates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return dates;
};

const getStats_MailESendToHuman = async (pluginId: string, startDate: Date, endDate: Date) => {
	const stats = await PluginStat_MailE_SendMailToHuman.find({
		pluginId,
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	}).exec();

	const categorizedStats: Record<string, Record<string, number>> = {};

	const dateRange = generateDateRange(startDate, endDate);
	// Initialize the structure
	for (const date of dateRange) {
		const dateString = date.toISOString().split("T")[0];
		for (const stat of stats) {
			if (!categorizedStats[stat.category]) {
				categorizedStats[stat.category] = {};
			}
			if (!categorizedStats[stat.category][dateString]) {
				categorizedStats[stat.category][dateString] = 0;
			}
		}
	}

	// Count stats per day and category
	for (const stat of stats) {
		const dateString = stat.date.toISOString().split("T")[0];
		if (!categorizedStats[stat.category][dateString]) {
			categorizedStats[stat.category][dateString] = 0;
		}
		categorizedStats[stat.category][dateString]++;
	}

	return categorizedStats;
};

const getStats_KnowledgeTool = async (pluginId: string, startDate: Date, endDate: Date) => {
	const stats = await PluginStat_KnowledgeTool.find({
		pluginId,
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	});

	const categorizedStats: Record<string, Record<string, number>> = {};
	const dateRange = generateDateRange(startDate, endDate);

	for (const date of dateRange) {
		const dateString = date.toISOString().split("T")[0];

		for (const stat of stats) {
			const queryString = stat.query.toLowerCase();
			if (!categorizedStats[queryString]) {
				categorizedStats[queryString] = {};
			}

			if (!categorizedStats[queryString][dateString]) {
				categorizedStats[queryString][dateString] = 0;
			}
		}
	}

	for (const stat of stats) {
		const dateString = stat.date.toISOString().split("T")[0];
		const queryString = stat.query.toLowerCase();
		if (!categorizedStats[queryString][dateString]) {
			categorizedStats[queryString][dateString] = 0;
		}
		categorizedStats[queryString][dateString]++;
	}

	return categorizedStats;
};

router.get(
	"/plugin-stats",
	authenticationMiddleware,
	checkOrganizationAccess,
	async (ctx: Context) => {
		try {
			const params = ctx.request.url.searchParams;

			const endDateParam = params.get("endDate");
			const startDateParam = params.get("startDate");
			const organization = ctx.state.organization;

			if (!organization) throw "missing-id";
			if (!endDateParam) throw "missing-endDate;";
			if (!startDateParam) throw "missing-startDate";

			const endDate = new Date(decodeURIComponent(endDateParam));
			const startDate = new Date(decodeURIComponent(startDateParam));

			const plugins = await getAlexPlugins(organization);

			const allStats: Record<string, object> = {};
			for (const plugin of plugins) {
				if (plugin.name.endsWith("mailE-sendToHuman")) {
					const plugStats = await getStats_MailESendToHuman(
						plugin._id.toString(),
						startDate,
						endDate
					);

					const uniqeKey = (plugin.config as { nameOfHuman: string }).nameOfHuman;
					allStats[plugin.name + "__" + uniqeKey] = plugStats;
				}

				if (plugin.name.endsWith("knowledge")) {
					allStats.knowledge = await getStats_KnowledgeTool(
						plugin._id.toString(),
						startDate,
						endDate
					);
				}
			}

			return handleResponseSuccess(ctx, {
				status: "success",
				message: "Lyckades hitta stats.",
				stats: allStats,
			});
		} catch (error) {
			console.error(error);
			if (error instanceof mongoose.Error.CastError) {
				handleResponseError(ctx, {
					status: "invalid-id",
					message: "Kunde inte hitta statistiken. ID:et är ogiltigt.",
				});
				return;
			}
			handleResponseError(ctx, {
				status: "internal-error",
				message: "Tekniskt fel.",
			});
		}
	}
);

export default router;
