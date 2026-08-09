import Docker from "dockerode";

export const docker = new Docker();

export async function testDocker() {
    const info = await docker.info();

    console.log("Docker connected");
    console.log(info.ServerVersion);
}

export async function buildImage(sourcePath: string, imageName: string) {
    console.log("Docker Image called");
    const stream = await docker.buildImage( {
        context: sourcePath,
        src: [
            "Dockerfile",
            "package.json",
            "package-lock.json",
            "index.js"
        ]
    } ,{ t: imageName});
    

    await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (error, result) => {
            if(error) reject(error);
            else resolve(result);
        },
        event=>{
            console.log(event);
        }
    )
    })
}