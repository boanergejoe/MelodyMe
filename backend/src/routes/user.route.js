import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, likeSong, unlikeSong, getLikedSongs, activatePremium, getMe } from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/me", protectRoute, getMe);
// song liking endpoints
router.post("/songs/:songId/like", protectRoute, likeSong);
router.delete("/songs/:songId/like", protectRoute, unlikeSong);
router.get("/songs/liked", protectRoute, getLikedSongs);
// premium activation endpoint
router.post("/activate-premium", protectRoute, activatePremium);

export default router;
