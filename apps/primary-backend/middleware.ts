import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    // console.log("token", token);

    if (!token) {
         res.status(401).json({ message: "Unauthorized" });
         return
    }

    const parts = token.split(" ")[1];

    const decoded = jwt.verify(parts, process.env.JWT_PUBLIC_KEY as string);
    if (!decoded) { 
         res.status(401).json({ message: "Unauthorized" });
         return
    }

    const userId = decoded.sub as string;

    if(!userId) {
         res.status(401).json({ message: "Unauthorized" });
         return
    }

    req.userId = userId

    next();

    
}