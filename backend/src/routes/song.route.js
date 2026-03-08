import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, getMostPopularSongs, searchSongs, getSongById } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// /songs returns all songs for logged-in users (removed admin restriction so regular
// listeners can browse; originally only admins could fetch this)
router.get("/", protectRoute, getAllSongs);
router.get("/:id", getSongById);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/popular", getMostPopularSongs);

// search endpoint - does not require admin but should check logged in if desired
router.get("/search", searchSongs);

export default router;
