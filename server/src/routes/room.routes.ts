import { Router } from "express";
import {
  createRoom,
  getMyRooms,
  getRoomById,
  deleteRoom,
  getRoomSummary,
} from "../controllers/room.controller";
import { protect } from "../middlewares/auth";

const router = Router();

/*
  Rooms
*/
router.post("/", protect, createRoom);
router.get("/", protect, getMyRooms);
router.get("/:id", protect, getRoomById);
router.delete("/:id", protect, deleteRoom);

/*
  AI Summary
*/
router.get("/:id/summary", protect, getRoomSummary);

export default router;
