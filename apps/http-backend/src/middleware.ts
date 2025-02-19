import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-utils/config";

interface AuthRequest extends Request {
    userId: string | JwtPayload
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization ?? "";

    if(!token) {
        return;
    }
    const decodedData = jwt.verify(token, JWT_SECRET);
    if(decodedData) {
        (req as AuthRequest).userId = (decodedData as AuthRequest).userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}