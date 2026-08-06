import { Request, Response } from "express";
import prisma from "../lib/prisma.ts";

export async function createDeployment(req: Request, res: Response) {
    const deployment = await prisma.deployment.create({
        data: {
            repositoryId:req.body.repositoryId
        }
    });

    res.json({
        message: "Deployment created",
        deployment
    });
}