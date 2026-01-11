import { z } from "zod";

/* =======================
   Create Room
======================= */
export const CreateRoomSchema = z.object({
    name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Room name too long"),
    ownerId: z.string().uuid(),
});

export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;

export const RoomMemberSchema = z.object({
    roomId: z.string().uuid(),
    userId: z.string().ulid().optional()
});

export type RoomMemberDTO = z.infer<typeof RoomMemberSchema>;

/* =======================
   Room Response (Public)
======================= */
export const RoomResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
});

export type RoomResponse = z.infer<typeof RoomResponseSchema>;
