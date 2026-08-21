import express from "express";
import deploymentRoutes from "./routes/deployment.routes.ts"
import repositoryRoutes from "./routes/repository.routes.ts"
import http from "http";
import { initializeSocket } from "./socket.ts";
import cors from "cors";

const app = express();
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));
app.use(express.json());

const server = http.createServer(app);
initializeSocket(server);

app.use("/deployments", deploymentRoutes);
app.use("/repositories", repositoryRoutes);
// app.use

app.get("/", async(req,res) => {
    res.json("working");
});


server.listen(3000, ()=> {
    console.log("app running on 3000");
})