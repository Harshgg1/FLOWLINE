import express from "express";
import deploymentRoutes from "./routes/deployment.routes.ts"
import repositoryRoutes from "./routes/repository.routes.ts"

const app = express();
app.use(express.json());

app.use("/deployments", deploymentRoutes);
app.use("/repositories", repositoryRoutes);

app.get("/", async(req,res) => {
    res.json("working");
});

app.listen(3000, ()=> {
    console.log("app running on 3000");
})