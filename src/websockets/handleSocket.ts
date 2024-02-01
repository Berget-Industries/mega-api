import { Server, Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import handleMailerSocket from "./mailerSocket.ts";

export default function handleSocket(io: Server, socket: Socket) {
	socket.on("register-mailer", (data) => {
		console.log("register-mailer", data);
		handleMailerSocket(io, socket);
	});
}
