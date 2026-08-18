import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

import { REPOSITORY_ROOT } from "../config/path";


export async function cloneRepository(
    repositoryUrl: string,
    deploymentId: string
): Promise<string> {

    const deploymentPath = path.join(
        REPOSITORY_ROOT,
        deploymentId
    );

    const sourcePath = path.join(
        deploymentPath,
        "source"
    );

    await fs.mkdir(deploymentPath, { recursive:true});

    const gitProcess = spawn("git", [ "clone", repositoryUrl, sourcePath]);

    gitProcess.stdout.on("data", data=> {
            console.log(data.toString());
    });

    gitProcess.stderr.on("data",data => {
        console.error(data.toString());
    });

    return new Promise<string>((resolve, reject) => {
        gitProcess.on("close", code => {
            if(code === 0) {resolve(sourcePath);}
            else { reject (new Error("Clone failed"));}
        })
    })
};