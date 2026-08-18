import { docker } from "./docker.service";

export async function createContainer(imageName:string){
    const container = await docker.createContainer({
        Image: imageName,
        name: `flowline-${Date.now()}`,

        ExposedPorts: { "3000/tcp": {}},

        HostConfig: {
            PortBindings: {
                "3000/tcp" : [
                    {
                        HostPort:"8080"
                    }
                ]
            }
        }

    });

    return container;
}

export async function startContainer(container:any) {
    await container.start();
}