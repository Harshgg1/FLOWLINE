import Redis from "ioredis";
import { Server } from "socket.io";

const CHANNEL = "deployment-logs";

export function startDeploymentLogSubscriber(io: Server) {
    const subscriber = new Redis(process.env.REDIS_URL!);

    subscriber.subscribe(CHANNEL, (error) => {
        if (error) {
            console.error(
                "Failed to subscribe to deployment logs:",
                error
            );
            return;
        }

        console.log(
            `Subscribed to Redis channel: ${CHANNEL}`
        );
    });

    subscriber.on("message", (channel, message) => {
        if (channel !== CHANNEL) {
            return;
        }

        try {
            const log = JSON.parse(message);

            console.log("Deployment log received:", log);

            io
                .to(`deployment:${log.deploymentId}`)
                .emit("deployment-log", log);

        } catch (error) {
            console.error(
                "Failed to process deployment log:",
                error
            );
        }
    });

    subscriber.on("error", (error) => {
        console.error(
            "Redis subscriber error:",
            error
        );
    });

    return subscriber;
}