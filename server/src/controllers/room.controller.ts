import { Request, Response, NextFunction } from "express";
import { RoomService } from "../services/room.service";
import { CreateRoomDTO, RoomMemberDTO } from "../dtos/room.dto";
import { AiSummaryService } from "../services/AiSummaryService";


const roomService = new RoomService();
const aiSummaryService = new AiSummaryService();

export async function createRoom(
    req: Request<{}, {}, CreateRoomDTO>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const room = await roomService.createRoom(req.body);

        res.status(201).json(room);
    } catch (err) {
        next(err);
    }
}

export async function getMyRooms(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const rooms = await roomService.getUserRooms(req.user!.id);
        res.json(rooms);
    } catch (err) {
        next(err);
    }
}

export async function getRoomById(
    req: Request<{ id: string }, {}, RoomMemberDTO>,
    res: Response,
    next: NextFunction
) {
    try {
        console.log(req.params);
        const { id } = req.params;
        console.log(id);
        const room = await roomService.getRoomById({ roomId: id, userId: req.user?.id });

        res.json(room);
    } catch (err) {
        next(err);
    }
}

export async function deleteRoom(
    req: Request<{}, {}, RoomMemberDTO>,
    res: Response,
    next: NextFunction
) {
    try {
        await roomService.deleteRoom(req.body);
        
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function getRoomSummary(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const roomId = req.params.roomId;
        const userId = req.user!.id;

        const summary = await aiSummaryService.summarizeRoom(roomId, userId);

        res.json({ summary });
    } catch (err) {
        next(err);
    }
}



