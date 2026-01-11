import axios from "axios";
import { prisma } from "../config/db";
import { redis } from "../config/redis";
import { ApiError } from "../errors/ApiError";
import { ENV } from "../config/env";

export class AiSummaryService {

  async summarizeRoom(roomId: string, userId: string): Promise<string> {

    // Authorization (SERVICE responsibility)
    const isMember = await prisma.roomMember.findUnique({
      where: {
        user_id_room_id: {
          user_id: userId,
          room_id: roomId,
        },
      },
    });

    if (!isMember) {
      throw ApiError.forbidden("You are not a member of this room");
    }

    // Redis cache
    const cacheKey = `room:${roomId}:summary`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch recent messages
    const messages = await prisma.message.findMany({
      where: { room_id: roomId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        content: true,
        user: { select: { name: true } }
      }
    });

    if (messages.length === 0) {
      return "No messages to summarize yet.";
    }

    const conversation = messages
      .reverse()
      .map(m => `${m.user.name}: ${m.content}`)
      .join("\n");

    // OpenAI prompt
    const prompt = `
Summarize the following conversation in 3–5 bullet points.
Focus on main topics and decisions.
Ignore greetings and small talk.

Conversation:
${conversation}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a conversation summarizer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const summary = response.data.choices[0].message.content;

    // Cache result
    await redis.set(cacheKey, summary, { EX: 60 * 5 });

    return summary;
  }
}
