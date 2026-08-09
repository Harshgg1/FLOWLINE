import "./queue/worker.ts"
import { testDocker } from "./services/docker.service.ts"

testDocker();

console.log("worker running");