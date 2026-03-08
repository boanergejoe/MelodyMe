import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getMostPopularSongs = async (req, res, next) => {
	try {
		const songs = await Song.find()
			.sort({ likesCount: -1 }) // Sort by likes count descending
			.limit(10) // Get top 10 most liked songs
			.select('_id title artist imageUrl audioUrl duration likesCount');

		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

// server-side search endpoint. users can call /api/songs/search?q=term
// similar to Spotify's Search API: https://developer.spotify.com/documentation/web-api/reference/#/operations/search
export const searchSongs = async (req, res, next) => {
	try {
		const { q } = req.query;
		if (!q) return res.status(400).json({ message: "Query parameter q is required" });

		// simple case-insensitive regex search on title or artist
		const regex = new RegExp(q, "i");
		const results = await Song.find({
			$or: [{ title: regex }, { artist: regex }],
		});
		res.status(200).json(results);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getSongById = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (id === "popular") {
			// Return popular songs if 'popular' is passed
			const songs = await Song.find().sort({ likesCount: -1 }).limit(10);
			return res.json(songs);
		}
		if (id === "trending") {
			// Return trending songs if 'trending' is passed
			const songs = await Song.aggregate([
				{ $sample: { size: 4 } },
				{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } }
			]);
			return res.json(songs);
		}
		// Validate ObjectId
		const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
		if (!isValidObjectId) {
			// If not valid ObjectId, return all songs (or you can customize to return featured, trending, etc.)
			const songs = await Song.find().sort({ createdAt: -1 });
			return res.json(songs);
		}
		const song = await Song.findById(id);
		if (!song) return res.status(404).json({ message: "Song not found" });
		res.json(song);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getPopularSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ likesCount: -1 }).limit(10);
		res.json(songs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};


