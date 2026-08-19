import Redis from "ioredis";

const publisher = new Redis(process.env.REDIS_URL!);

const CHANNEL = "deployment-logs";

export async function publishDeploymentLog(
    deploymentId: string,
    message: string,
    type: "INFO" | "BUILD" | "ERROR"
) {
    await publisher.publish(
        CHANNEL,
        JSON.stringify({
            deploymentId,
            message,
            type,
            timestamp: Date.now()
        })
    );
}