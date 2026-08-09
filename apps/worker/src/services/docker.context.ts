import fs from "fs";
import path from "path";
import tar from "tar-stream";


export function createDockerContext(sourcePath:string){

    const pack = tar.pack();


    function addFolder(folder:string){

        const files = fs.readdirSync(folder);


        for(const file of files){

            const fullPath = path.join(folder,file);

            const stat = fs.statSync(fullPath);


            if(stat.isDirectory()){

                addFolder(fullPath);

            }
            else{

                pack.entry(
                    {
                        name:path.relative(sourcePath,fullPath)
                    },
                    fs.readFileSync(fullPath)
                );

            }

        }

    }


    addFolder(sourcePath);


    pack.finalize();


    return pack;
}