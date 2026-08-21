import prisma from "@flowline/db";

export async function getDeploymentLogs( deploymentId: string) {
    return prisma.deploymentLog.findMany({ where: {deploymentId}, orderBy: {createdAt: "asc"}});
}