import { Job, Worker } from "bullmq";
import { connection } from "./connection.ts";
import { DEPLOYMENT_QUEUE } from "@flowline/shared";
import prisma from "@flowline/db";
import { cloneRepository } from "../services/git.service.ts";
import { buildImage } from "../services/docker.service.ts";

export const deploymentWorker = new Worker(DEPLOYMENT_QUEUE,
        async Job => {
            console.log("recieved job");
            console.log(Job.data);

            const deployment = await prisma.deployment.findUnique({ 
                where: { id: Job.data.deploymentId},
                include : {
                    repository: true
                }
            });

            if (!deployment) {
                throw new Error("Deployment not found");
            }

            await prisma.deployment.update({
                where:{
                    id:deployment.id
                },
                data:{
                    status:"CLONING"
                }
            });

            const sourcePath = await cloneRepository(
                deployment.repository.url,
                deployment.id
            );

            console.log("Repository cloned at:", sourcePath);

            await prisma.deployment.update({
                where: {
                    id: deployment.id
                },
                data: {
                    status: "BUILDING"
                }
            });
            const imageName = `flowline/${deployment.id}:latest`;

            await buildImage(
                sourcePath,
                imageName
            );

            console.log("Image built:", imageName);
            console.log("Docker build finished");

        },
        { connection}
);