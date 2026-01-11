import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../errors/ApiError";


export const validate = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
            const message = (err as Error).message || "Invalid data";
            return next(ApiError.badRequest(message));
        }
    };