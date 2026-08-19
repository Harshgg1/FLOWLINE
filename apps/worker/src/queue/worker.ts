import { Job, Worker } from "bullmq";
import { connection } from "./connection";
import { DEPLOYMENT_QUEUE } from "@flowline/shared";
import prisma from "@flowline/db";
import { cloneRepository } from "../services/git.service";
import { buildImage } from "../services/docker.service";
import { createContainer, startContainer } from "../services/container.service";

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

            try {
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
                    imageName,
                    deployment.id
                );

                console.log("Image built:", imageName);
                console.log("Docker build finished");

                await prisma.deployment.update({
                    where: {
                        id: deployment.id
                    },
                    data: {
                        status: "STARTING",
                        imageName
                    }
                    });

                const container = await createContainer(imageName);
                console.log("Container created:", container.id);

                await startContainer(container);
                console.log("Container started");

                await prisma.deployment.update({
                    where: {
                        id: deployment.id
                    },
                    data: {
                        status: "RUNNING",
                        containerId: container.id
                    }
                    });
            }
        catch (error) {
    console.error(
        `Deployment ${deployment.id} failed:`,
        error
    );

    try {
        await prisma.deployment.update({
            where: {
                id: deployment.id
            },
            data: {
                status: "FAILED"
            }
        });
        } 
        catch (statusError) {
            console.error(
                "Failed to update deployment status:",
                statusError
            );
        }

        throw error;
    }


        },
        { connection}
);