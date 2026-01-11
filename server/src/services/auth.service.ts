import { hash, compare } from "bcryptjs";
import { prisma } from "../config/db";
import { RegisterDTO, LoginDTO } from "../dtos/user.dto";
import { ApiError } from "../errors/ApiError";
import { AuthUser } from "../types/auth.types";
import { redis } from "../config/redis";



export class AuthService {
  async register(data: RegisterDTO): Promise<AuthUser> {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: data.email }
      });
      if (existing) throw ApiError.badRequest("Email already registered");

      const hashedPassword = await hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword
        }
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("Register error:", err);
      throw ApiError.internal("Internal server error");
    }
  }
  
  async login(
    data: LoginDTO,
    ip: string
  ): Promise<AuthUser> {
  try {
    // Redis Login Rate Limit
    const rateKey = `rate:login:ip:${ip}`;
    const attempts = await redis.incr(rateKey);

    if (attempts === 1) {
      await redis.expire(rateKey, 60); // 60 seconds window
    }

    if (attempts > 5) {
      throw ApiError.tooManyRequests(
        "Too many login attempts. Please try again later."
      );
    }
    // Authentication
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      // Keep generic message
      throw ApiError.unauthorized("Invalid email or password");
    }

    const match = await compare(data.password, user.password!);
    if (!match) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Success → reset counter
    await redis.del(rateKey);

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };

  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.error("Login error:", err);
    throw ApiError.internal("Internal server error");
  }
}


  async findUserById(id: string): Promise<AuthUser> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      if (!user) throw ApiError.notfound("User not found");
      return user;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw ApiError.internal("Internal server error");
    }
  }

  logout() {
    return { success: true, message: "Logged out successfully" };
  }
}
