"use client"
import axios from "axios";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export const Prompt = () => {
    const [prompt, setPrompt] = useState("")
    const { getToken } = useAuth();
    return (
        <div>
            <Textarea   onChange={(e) => setPrompt(e.target.value)} className="w-full h-40 border border-gray-300 rounded-md p-2" placeholder="Prompt"></Textarea>
            <div className="flex justify-end pt-2">
                <Button onClick={async()=> {
                    const token = await getToken();
                    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
                    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project`, {
                        prompt: prompt
                    }, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                }} >
                    send
                </Button>
            </div>
        </div>
    );
}