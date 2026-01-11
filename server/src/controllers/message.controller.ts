import { Request, Response, NextFunction } from "express";
import { MessageService } from "../services/message.service";
import { io } from "../socket";


const messageService = new MessageService();

  /* =======================
     Get room messages
  ======================= */
export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const roomId = req.params.roomId;
    const userId = req.user!.id;

    const limit = Math.min(
      parseInt(req.query.limit as string) || 50,
      100 // hard cap to protect DB
    );

    const cursor = req.query.cursor as string | undefined;

    const result = await messageService.getMessages(
      roomId,
      userId,
      limit,
      cursor
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}


  /* =======================
     Send message (REST)
  ======================= */
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
      const roomId = req.params.roomId;
      const userId = req.user!.id;

      const message = await messageService.sendMessage({
        roomId,
        senderId: userId,
        text: req.body,
      });
      
      io.to(roomId).emit("message:new", message);

      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
}

