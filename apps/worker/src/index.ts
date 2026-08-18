import "./queue/worker"
import { testDocker } from "./services/docker.service"

testDocker();

console.log("worker running");