import { prisma } from "../config/db";
import { CreateRoomDTO, RoomMemberDTO, RoomResponse } from "../dtos/room.dto";
import { ApiError } from "../errors/ApiError";

export class RoomService {
  async createRoom(data: CreateRoomDTO): Promise<RoomResponse> {
    try {
      return await prisma.$transaction(async (tx) => {
        const room = await tx.room.create({
          data: {
            name: data.name,
            owner_id: data.ownerId,
          },
        });

        await tx.roomMember.create({
          data: {
            user_id: room.owner_id,
            room_id: room.id,
          },
        });

        return {
          id: room.id,
          name: room.name,
          ownerId: room.owner_id,
          createdAt: room.createdAt,
        };
      });
    } catch (err) {
        throw ApiError.badRequest((err as Error).message);
    }
  };


    async getRoomById(data: RoomMemberDTO ): Promise<RoomResponse | ApiError> {

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

    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
      select: {
        id: true,
        name: true,
        owner_id: true,
        createdAt: true,
      },
    });

    if (!room) {
      throw ApiError.notfound("Room not found");
    }

    return {
      id: room.id,
      name: room.name,
      ownerId: room.owner_id,
      createdAt: room.createdAt,
    };
  };

  async getUserRooms(userId: string): Promise<RoomResponse[] | ApiError> {

    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { owner_id: userId },
          {
            members: {
              some: { user_id: userId },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        owner_id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rooms.map(room => ({
      id: room.id,
      name: room.name,
      ownerId: room.owner_id,
      createdAt: room.createdAt,
    }));
  };

  async deleteRoom(data: RoomMemberDTO): Promise<void> {

    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    });

    if (!room) {
      throw ApiError.notfound("Room not found");
    }

    if (room.owner_id !== data.userId) {
      throw ApiError.forbidden("Only the owner can delete the room");
    }

    await prisma.room.delete({
      where: { id: data.roomId },
    });
  }
};