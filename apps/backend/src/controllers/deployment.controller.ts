import { Request, Response } from "express";
import prisma from "../lib/prisma.ts";
import { deploymentQueue } from "../queue/deployment.queue.ts";
import  {getDeploymentLogs}  from "../services/deployment-log.service.ts";

export async function createDeployment(req: Request, res: Response) {
    const deployment = await prisma.deployment.create({
        data: {
            repositoryId:req.body.repositoryId
        }
    });
    await deploymentQueue.add("deploy", { deploymentId: deployment.id});

    res.json({
        message: "Deployment created",
        deployment
    });
};

export async function getDeploymentLog( req: Request<{deploymentId: string}>, res: Response) {
    const { deploymentId } = req.params;
    const logs = await getDeploymentLogs(deploymentId);
    res.json(logs);
}