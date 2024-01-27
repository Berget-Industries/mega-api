import { Server, Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { Worker, Plugin } from "../models/index.ts";

export default async function handleMailerSocket(io: Server, socket: Socket) {
	socket.join("mailer");

	const plugins = await Plugin.find({ name: "mailer", isActivated: true, worker: null });
	const pluginIdsToAssign = plugins.slice(0, 10).map((plugin) => plugin._id);

	const worker = await Worker.create({ socketId: socket.id, plugins: pluginIdsToAssign });

	await Plugin.updateMany({ _id: { $in: pluginIdsToAssign } }, { worker: worker._id });

	const nextSetOfConfigs = (
		await Plugin.find({
			name: "mailer",
			isActivated: true,
			worker: worker._id,
		})
	).map((plugin) => plugin.config);

	socket.emit("mailer_asigned-configs", nextSetOfConfigs);

	const handleDisconnect = async () => {
		console.log("Mailer disconnected");
		await Worker.findOneAndDelete({ socketId: socket.id });
		await Plugin.updateMany({ worker: worker._id }, { worker: null });
	};

	socket.on("disconnect", handleDisconnect);
}
