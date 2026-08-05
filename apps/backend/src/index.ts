import express from "express";

const app = express();

app.get("/", (req,res) => {
    res.json("working");
});

app.listen(3000, ()=> {
    console.log("app running on 3000");
})