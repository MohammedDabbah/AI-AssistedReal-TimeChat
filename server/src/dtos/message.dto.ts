import z from "zod";

export const MessageSchema = z.object({
    text: z.string().min(1).max(1000),
    senderId: z.string(),
    roomId: z.string()
});

export type MessageDTO = z.infer<typeof MessageSchema>