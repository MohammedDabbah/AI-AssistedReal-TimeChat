import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  joinRoom,
  leaveRoom,
  getRoomUsers,
} from "../controllers/roomMember.controller";

const router = Router();

/*
  Room membership
*/
router.post("/rooms/:roomId/join", protect, joinRoom);
router.delete("/rooms/:roomId/leave", protect, leaveRoom);
router.get("/rooms/:roomId/users", protect, getRoomUsers);

export default router;
