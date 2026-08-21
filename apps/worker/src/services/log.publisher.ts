import Redis from "ioredis";
type DeploymentLogPayload = {
  id: string;
  deploymentId: string;
  message: string;
  type: string;
  createdAt: Date;
};

const publisher = new Redis(process.env.REDIS_URL!);

const CHANNEL = "deployment-logs";

export async function publishDeploymentLog(log: DeploymentLogPayload) {
    await publisher.publish(
        CHANNEL,
        JSON.stringify(log)
    );
}