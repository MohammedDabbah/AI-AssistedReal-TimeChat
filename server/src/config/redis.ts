import { createClient } from "redis";
import { ENV } from "./env";

export const redis = createClient({
    url: ENV.REDIS_URL
});

redis.on("error", (err) => {
    console.error("Redis Client Error", err);
});

export async function connectRedis() {
    if(!redis.isOpen) {
        await redis.connect();
        console.log("Redis connected");
    }
};