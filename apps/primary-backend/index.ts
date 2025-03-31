
import { prismaClient } from "db/client";

import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";


declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}



const app = express();
app.use(express.json())
app.use(cors());


app.post("/project",authMiddleware, async(req, res) => {

    const { prompt  } = req.body;  
    const userId = req.userId!
    console.log("userID", userId);
    const name = prompt.split("\n")[0]
    const project = await prismaClient.project.create({
        data: {
            description: name,
            userId
        }
    })
    res.json({
        projectId: project.id
    })
});

app.get("/projects",authMiddleware, async(req, res) => {
    const userId = req.userId;
    const project = await prismaClient.project.findFirst({
        where: {
            userId
        }
    })
    res.json(project)
});





app.listen(8000)



