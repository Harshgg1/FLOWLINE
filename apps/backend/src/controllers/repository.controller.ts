import prisma from "../lib/prisma.ts";
import { Request, Response } from "express";

export async function createRepoitory( req: Request, res:Response) {
    const {name, url, branch, userId} = req.body;

    const repository = await prisma.repository.create({
        data: {
            name,
            url, 
            branch, 
            userId
        }
    });
    res.json(repository);
}