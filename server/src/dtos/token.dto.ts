import z from "zod";
import { Types } from "mongoose";

export const TokenSchema = z.object({
    userId: z.union([
        z.string(),
        z.instanceof(Types.ObjectId)
    ]).optional(),
    userRole: z.string().optional(),
    token: z.string().optional()
});

export type TokenDTO = z.infer<typeof TokenSchema>;