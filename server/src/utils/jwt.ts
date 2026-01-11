import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { ENV } from "../config/env";



interface JwtPayload {
  id: string;
  role: string;
  exp: number;
};

export const generateAccessToken = (id: string): string => {
    return sign({ id }, ENV.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
};

export const generateRefreshToken = (id: string): string => {
    return sign({ id }, ENV.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
    res.cookie("Backend", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearRefreshTokenCookie = (res: Response): void => {
    res.clearCookie("Backend", {
        httpOnly: true,
        secure: ENV.NODE_ENV !== "development",
        sameSite: "strict",
    });
};

export const verifyAccessToken = (token: string ): JwtPayload => {
    return verify(token, ENV.ACCESS_TOKEN_SECRET) as JwtPayload;
};
