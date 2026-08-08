import { Job, Worker } from "bullmq";
import { connection } from "./connection.ts";
import { DEPLOYMENT_QUEUE } from "@flowline/shared";

export const deploymentWorker = new Worker(DEPLOYMENT_QUEUE,
        async Job => {
            console.log("recieved job");
            console.log(Job.data);
        },
        { connection}
);