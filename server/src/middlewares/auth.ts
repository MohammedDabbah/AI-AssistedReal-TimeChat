import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { verify } from "jsonwebtoken";
import { ENV } from "../config/env";

export const protect = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try{
        const authHeader = req.header("Authorization");

        const token = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : undefined;

        if(!token)
            throw ApiError.unauthorized("No access token provided");

        const decoded = verify(token, ENV.ACCESS_TOKEN_SECRET) as { id: string, role: string };

        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch(err: any){
        return next(ApiError.unauthorized(`Invalid or expired access token:\n${(err as Error).message}`));
    }
}