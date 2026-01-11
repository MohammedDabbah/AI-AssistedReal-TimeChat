import { Response } from "express";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/jwt";
import { ENV } from "../config/env";
import { verify } from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
import { TokenDTO } from "../dtos/token.dto";

interface JwtPayload {
  id: string;
  exp: number;
};

export class TokenService {
    async issueTokensForUser(
        data: TokenDTO,
        res: Response
    ): Promise<string> {
        const id = data.userId?.toString();
    
        const accessToken = generateAccessToken(id!);
        const refreshToken = generateRefreshToken(id!);
    
        const decoded = verify(refreshToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
        
        await RefreshTokenModel.create({
            userId: id,
            accessToken: refreshToken,
            expiresAt: new Date(decoded.exp * 1000),
        });
    
        setRefreshTokenCookie(res, refreshToken);
        
        return accessToken;
    };

    async rotateRefreshToken(
    data: TokenDTO,
    res: Response
    ): Promise<string> {

    let decoded: JwtPayload;
    try {
        decoded = verify(data.token!, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch {
        throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const existing = await RefreshTokenModel.findOne({
        refreshToken: data.token,
        revoked: false
    });

    if (!existing)
        throw ApiError.notfound("Refresh token reuse detected");

    if (existing.expiresAt < new Date())
        throw ApiError.unauthorized("Refresh token expired");

    existing.revoked = true;
    await existing.save();

    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    const newDecoded = verify(newRefreshToken, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;

    await RefreshTokenModel.create({
        userId: decoded.id,
        accessToken: newRefreshToken,
        expiresAt: new Date(newDecoded.exp * 1000)
    });

    setRefreshTokenCookie(res, newRefreshToken);

    return accessToken;
    }

}