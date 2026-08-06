import { Router } from "express";
import { createRepoitory } from "../controllers/repository.controller.ts";

const router = Router();

router.post("/", createRepoitory);

export default router;