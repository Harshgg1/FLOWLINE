import Docker from "dockerode";
import { createDockerContext } from "./docker.context";
import { createDeploymentLog } from "./log.service";

export const docker = new Docker();

export async function testDocker() {
    const info = await docker.info();

    console.log("Docker connected");
    console.log(info.ServerVersion);
}

export async function buildImage(sourcePath: string, imageName: string, deploymentId:string) {
    console.log("Docker Image called");

    const context = createDockerContext(sourcePath);

    const stream = await docker.buildImage( 
        context,
        { t: imageName});
    

    await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (error, result) => {
            if(error) reject(error);
            else resolve(result);
        },
        event=>{
            // console.log(event);
            if(event.stream) {
                const message = event.stream.trim();
                if(message) {
                    console.log(message);

                    createDeploymentLog(deploymentId, message, "BUILD").catch(error => {
                        console.error("failed to save logs", error);
                    });
                }
            }
        }
    )
    })
}