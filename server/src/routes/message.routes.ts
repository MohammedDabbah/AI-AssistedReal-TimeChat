import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controller";

const router = Router();

/*
  Messages (room scoped)
  GET    /rooms/:roomId/messages
  POST   /rooms/:roomId/messages
*/

router.get("/rooms/:roomId/messages", protect, getMessages);
router.post("/rooms/:roomId/messages", protect, sendMessage);

export default router;
