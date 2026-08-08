import { Request, Response } from "express";
import prisma from "../lib/prisma.ts";
import { deploymentQueue } from "../queue/deployment.queue.ts";

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
}