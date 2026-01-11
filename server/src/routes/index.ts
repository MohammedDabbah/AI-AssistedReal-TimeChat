import { Router } from "express";
import authRoutes from "./auth.route";
import roomRoutes from "./room.routes";
import messageRoutes from "./message.routes";
import roomMemberRoutes from "./roomMember.routes";

const router = Router();

/*
  Auth
*/
router.use("/auth", authRoutes);

/*
  Rooms (includes AI summary)
*/
router.use("/rooms", roomRoutes);

/*
  Messages (room-scoped)
*/
router.use("/", messageRoutes);


router.use("/", roomMemberRoutes);

export default router;
