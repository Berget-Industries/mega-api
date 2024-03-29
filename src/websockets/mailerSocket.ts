import { Worker, Plugin } from "../models/index.ts";
import { Server, Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { globalEventTarget } from "../utils/globalEventTarget.ts";
import { Logger } from "https://deno.land/std@0.150.0/log/mod.ts";

const numberOfPluginsPerWorker = 10;

export default async function handleMailerSocket(io: Server, socket: Socket) {
	socket.join("mailer");

	const plugins = await Plugin.find({ name: "mailer", isActivated: true, worker: null });
	const pluginIdsToAssign = plugins
		.slice(0, numberOfPluginsPerWorker)
		.map((plugin: typeof Plugin) => plugin._id);

	const worker = await Worker.create({ socketId: socket.id, plugins: pluginIdsToAssign });
	await Plugin.updateMany({ _id: { $in: pluginIdsToAssign } }, { worker: worker._id });

	const nextSetOfConfigs = (
		await Plugin.find({
			name: "mailer",
			isActivated: true,
			worker: worker._id,
		})
	).map(({ _id, config }: typeof Plugin) => ({
		_id,
		config,
	}));

	socket.emit("mailer_assign-configs", nextSetOfConfigs);

	socket.on("disconnect", async () => {
		console.log("Mailer disconnected");
		await Worker.findOneAndDelete({ socketId: socket.id });
		await Plugin.updateMany({ worker: worker._id }, { worker: null });
	});

	socket.on("mailer_heartbeat", async (pluginId) => {
		await Plugin.findByIdAndUpdate(pluginId, { lastHeartbeat: new Date() });
	});

	socket.on("mailer_close", async (pluginId) => {
		const plugin = await Plugin.findById(pluginId);
		if (!plugin || !plugin.isActivated) {
			socket.emit("mailer_remove-config", pluginId);
		} else {
			socket.emit("mailer_update-config", {
				_id: plugin._id,
				config: plugin.config,
			});
		}
	});

	globalEventTarget.addEventListener("update-plugins-mailer", async (event) => {
		const plugin = await Plugin.findById(event.detail);

		if (!plugin || !plugin.isActivated) {
			socket.emit("mailer_remove-config", plugin._id);
			return;
		}

		if (!plugin.worker) {
			const nextWorkers = await Worker.find({});

			const nextWorker = nextWorkers.find((worker: typeof Worker) => {
				return worker.plugins.length < numberOfPluginsPerWorker;
			});

			if (!nextWorker) {
				console.log("No worker available");
				return;
			}

			if (`${nextWorker._id}` === `${worker._id}`) {
				plugin.worker = nextWorker._id;
				await plugin.save();

				nextWorker.plugins.push(plugin._id);
				await nextWorker.save();

				socket.emit("mailer_assign-config", {
					_id: plugin._id,
					config: plugin.config,
				});
			}

			return;
		}

		if (`${plugin.worker}` === `${worker._id}`) {
			socket.emit("mailer_update-config", {
				_id: plugin._id,
				config: plugin.config,
			});

			return;
		}
	});

	globalEventTarget.addEventListener("chain-starter-send-mail", (event) => {
		const { to, subject, text, from } = event.detail;
		socket.emit("chain-starter-send-mail", { to, subject, text, from });
	});
}
