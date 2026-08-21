import { Router } from "express";
import { createDeployment, getDeploymentLog } from "../controllers/deployment.controller.ts";
import { get } from "http";

const router = Router();

router.post("/", createDeployment);
router.get("/:deploymentId/logs", getDeploymentLog);

export default router;