import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { RegisterSchema, LoginSchema } from "../dtos/user.dto";
// import { googleAuth, googleCallback } from "../controllers/oauth.controller";


const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, me);
// router.get("/refresh", refreshToken);
// router.get("/google", googleAuth);
// router.get("/google/callback", googleCallback);

export default router;