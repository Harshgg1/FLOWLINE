import { Router } from "express";
import { createDeployment } from "../controllers/deployment.controller.ts";

const router = Router();

router.post("/", createDeployment);

export default router;