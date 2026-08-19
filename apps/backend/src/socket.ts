import { Server } from "socket.io";
import { startDeploymentLogSubscriber } from "./services/deployment-log.subscriber";

let io: Server;

export function initializeSocket(server: any) {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:3001",
            ],
            credentials: true,
        },
    });

    startDeploymentLogSubscriber(io);

    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        socket.on("join-deployment", (deploymentId: string) => {
            const room = `deployment:${deploymentId}`;

            socket.join(room);

            console.log(
                `Socket ${socket.id} joined ${room}`
            );
        });

        socket.on("disconnect", () => {
            console.log(
                "Socket disconnected:",
                socket.id
            );
        });
    });

    return io;
}

export function getIO() {
    return io;
}