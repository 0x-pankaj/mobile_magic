
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors"
import express from "express"
import { prismaClient } from 'db/client';
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

const app = express();
app.use(express.json())
app.use(cors());

app.post("/prompt", async(req, res) => {
    const { prompt , projectId } = req.body;  
    const client = new Anthropic();

    await prismaClient.prompt.create({
        data: {
            content: prompt,
            projectId,
            type: "USER" 
        }
    });

    const allPrompt = await prismaClient.prompt.findMany({
        where: {
            projectId
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    let artifactProcesor = new ArtifactProcessor("", onFileUpdate, onShellCommand);
    let artifact = "";

    console.log(allPrompt.map((p:any) => ({
        role: p.type === "USER" ? "user" : "assistant",
        content: p.content
    })));

    let response = client.messages.stream({
        messages: allPrompt.map((p:any) => ({
            role: p.role === "USER" ? "user" : "assistant",
            content: p.content
        })),
        system: systemPrompt,
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 8000 
    }).on("text", (text)=> {
        artifactProcesor.append(text);
        artifactProcesor.parse();
        artifact += text;
    }).on("finalMessage", async (message) => {
        console.log("done");
        await prismaClient.prompt.create({
            data: {
                content: artifact,
                projectId,
                type: "SYSTEM"
            }
        });
    }).on("error", (error) => {
        console.log(error);
    });
    

    res.json({
        message: "ok"
    });

    
});


app.listen(9091, () => {
    console.log("Worker listening on port 9091");
});