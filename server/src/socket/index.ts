import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../errors/ApiError";
import { redis } from "../config/redis";

import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        credentials: true
    }
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("No token provided"));

        const payload = verifyAccessToken(token);
        socket.data.userId = payload.id;
        next();
        } catch(err: any) {
            return next(ApiError.unauthorized((err as Error).message));
        }
});

io.on("connection", async (socket) => {
    const userId = socket.data.userId;
    console.log("User connected:", userId);

    // Map user -> socket
    await redis.set(`user:${userId}:socket`, socket.id);

    socket.on("room:join", async (roomId: string) => {
        socket.join(roomId);

        await redis.sAdd(`room:${roomId}:users`, userId);

        socket.to(roomId).emit("user:joined", userId);
    });

    socket.on("room:leave", async (roomId: string) => {
        socket.leave(roomId);

        await redis.sRem(`room:${roomId}:users`, userId);

        socket.to(roomId).emit("user:left", userId);
    });

    socket.on("disconnect", async () => {
        console.log("User disconnected:", userId);

        // Remove user from all rooms
        const keys = await redis.keys("room:*:users");
        for (const key of keys) {
        await redis.sRem(key, userId);
        }

        await redis.del(`user:${userId}:socket`);
    });
});
