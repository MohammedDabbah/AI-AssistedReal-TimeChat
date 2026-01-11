import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { RegisterDTO, LoginDTO } from "../dtos/user.dto";
import { ApiError } from "../errors/ApiError";
import { clearRefreshTokenCookie } from "../utils/jwt";



const authService = new AuthService();
const tokenService = new TokenService();


export const register = async (
    req: Request<{}, {} , RegisterDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.register(req.body);

        if(!user)
            throw ApiError.internal("Internal serverr error");

            const accessToken  = await tokenService.issueTokensForUser(
            {
                userId: user?.id  as string 
            }, res);
        
        
        res.status(201).json({
            success: true,
            accessToken,
            user
        });
        
    } catch(err) {
        next(err);
    }
};

export const login = async (
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket.remoteAddress ||
        "unknown";

        const user = await authService.login(req.body, ip);

        const accessToken  = await tokenService.issueTokensForUser(
            {
                userId: user?.id  as string 
            }, res);

        res.status(200).json({
        success: true,
        accessToken,
        user
        });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = authService.logout();
    clearRefreshTokenCookie(res);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};


export const me = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.findUserById(req.user!.id);
        res.json({ success: true, user });
    } catch(err) {
        next(err);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldToken = req.cookies?.refreshToken;

    if (!oldToken) {
      throw ApiError.unauthorized("No refresh token");
    }

    const accessToken = await tokenService.rotateRefreshToken({ token: oldToken }, res);

    res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired refresh token"));
  }
};