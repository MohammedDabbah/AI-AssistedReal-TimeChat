import { z } from "zod";

/* =======================
   Join / Leave Room
======================= */
export const JoinRoomSchema = z.object({
  roomId: z.string().uuid(),
});

export type JoinRoomDTO = z.infer<typeof JoinRoomSchema>;
