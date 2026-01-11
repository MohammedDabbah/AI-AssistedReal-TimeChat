import { prisma } from "../config/db";
import { MessageDTO } from "../dtos/message.dto";
import { ApiError } from "../errors/ApiError";
import { redis } from "../config/redis";


export class MessageService {

  /* =======================
     Get Messages of a Room
     - Only room members
  ======================= */
  async getMessages(
  roomId: string,
  userId: string,
  limit = 50,
  cursor?: string
) {
  // Authorization
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

  // Fetch paginated messages
  const messages = await prisma.message.findMany({
    where: { room_id: roomId },
    take: limit,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // skip cursor itself
    }),
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Reverse so UI shows oldest → newest
  const normalized = messages.reverse().map(m => ({
    id: m.id,
    text: m.content,
    createdAt: m.createdAt,
    sender: {
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    },
  }));

  return {
    messages: normalized,
    nextCursor: messages.length ? messages[0].id : null,
  };
}


  /* =======================
     Send Message
     - Only room members
  ======================= */
  async sendMessage(data: MessageDTO) {
  try {
    // Authorization
    const isMember = await prisma.roomMember.findUnique({
      where: {
        user_id_room_id: {
          user_id: data.senderId,
          room_id: data.roomId,
        },
      },
    });

    if (!isMember) {
      throw ApiError.forbidden("You are not a member of this room");
    }

    // Redis Rate Limiting
    const rateKey = `rate:message:${data.senderId}`;
    const count = await redis.incr(rateKey);

    // First message → start TTL window
    if (count === 1) {
      await redis.expire(rateKey, 5); // 5 seconds window
    }

    if (count > 20) {
      throw ApiError.tooManyRequests("Too many messages, slow down");
    }

    // Save Message
    const newMessage = await prisma.message.create({
      data: {
        user_id: data.senderId,
        room_id: data.roomId,
        content: data.text,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      id: newMessage.id,
      text: newMessage.content,
      createdAt: newMessage.createdAt,
      sender: {
        id: newMessage.user.id,
        name: newMessage.user.name,
        email: newMessage.user.email,
      },
    };

  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.internal("Failed to send message");
  }
}

}
