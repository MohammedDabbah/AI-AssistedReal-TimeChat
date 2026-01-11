import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
        const status = err.status || 500;

        res.status(status).json(
            {
                success: false,
                message: err.message || "Server error"
            }
        );
    };