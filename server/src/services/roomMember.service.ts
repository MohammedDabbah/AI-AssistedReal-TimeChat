import { prisma } from "../config/db";
import { ApiError } from "../errors/ApiError";
import { RoomMemberDTO } from "../dtos/room.dto";
import { redis } from "../config/redis";

export class RoomMemberService {

  /* =======================
     Join Room
  ======================= */
  async joinRoom(data: RoomMemberDTO): Promise<void> {
  if (!data.userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });

  if (!room) {
    throw ApiError.notfound("Room not found");
  }

  const existing = await prisma.roomMember.findUnique({
    where: {
      user_id_room_id: {
        user_id: data.userId,
        room_id: data.roomId,
      },
    },
  });

  if (existing) {
    throw ApiError.badRequest("User already joined this room");
  }

  await prisma.roomMember.create({
    data: {
      user_id: data.userId,
      room_id: data.roomId,
    },
  });

  // Redis: add user to room presence
  await redis.sAdd(`room:${data.roomId}:users`, data.userId);
}


  /* =======================
     Leave Room
  ======================= */
  async leaveRoom(data: RoomMemberDTO): Promise<void> {
  if (!data.userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      user_id_room_id: {
        user_id: data.userId,
        room_id: data.roomId,
      },
    },
  });

  if (!membership) {
    throw ApiError.forbidden("You are not a member of this room");
  }

  await prisma.roomMember.delete({
    where: {
      user_id_room_id: {
        user_id: data.userId,
        room_id: data.roomId,
      },
    },
  });

  // Redis: remove user from room presence
  await redis.sRem(`room:${data.roomId}:users`, data.userId);
}


  /* =======================
     Get Room Users
  ======================= */
  async getRoomUsers(data: RoomMemberDTO) {
    // Only members can see users
    const isMember = await prisma.roomMember.findUnique({
      where: {
        user_id_room_id: {
          user_id: data.userId!,
          room_id: data.roomId,
        },
      },
    });

    if (!isMember) {
      throw ApiError.forbidden("You are not a member of this room");
    }

    const members = await prisma.roomMember.findMany({
      where: { room_id: data.roomId },
      select: {
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    return members.map(m => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      joinedAt: m.joinedAt,
    }));
  }
}
