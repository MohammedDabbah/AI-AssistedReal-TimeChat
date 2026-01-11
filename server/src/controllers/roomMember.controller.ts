import { Request, Response, NextFunction } from "express";
import { RoomMemberService } from "../services/roomMember.service";
import { RoomMemberDTO } from "../dtos/room.dto";

const roomMemberService = new RoomMemberService();

export async function joinRoom(
    req: Request<{}, {}, RoomMemberDTO>,
    res: Response,
    next: NextFunction) {
    try {
        await roomMemberService.joinRoom(req.body);

        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
  }

export async function leaveRoom(
    req: Request<{}, {}, RoomMemberDTO>,
    res: Response,
    next: NextFunction) {
    try {
      await roomMemberService.leaveRoom(req.body);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

export async function  getRoomUsers(
    req: Request<{}, {}, RoomMemberDTO>,
    res: Response,
    next: NextFunction) {
    try {
        const users = await roomMemberService.getRoomUsers(req.body);

        res.json(users);
    } catch (err) {
      next(err);
    }
  }
