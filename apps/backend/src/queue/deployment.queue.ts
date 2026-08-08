import { connection } from "./connection";
import {Queue} from "bullmq";
import { DEPLOYMENT_QUEUE } from "@flowline/shared"

export const deploymentQueue = new Queue(DEPLOYMENT_QUEUE, { connection});