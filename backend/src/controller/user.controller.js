// Activate premium status for user
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";

export const activatePremium = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		if (!userId) return res.status(401).json({ message: "Unauthorized" });
		const user = await User.findOne({ clerkId: userId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Save payment record with fixed receiver accounts
		const { method = "Bank Card", amount = 9.99 } = req.body;
		await Payment.create({
			userId,
			method,
			amount,
			receiverBankAccount: "5273 6400 8618 9896",
			receiverMobileMoney: "+250 795 757 432",
			status: "completed"
		});

		user.premium = true;
		await user.save();
		res.status(200).json({ success: true, premium: true });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

import { Message } from "../models/message.model.js";
import { Song } from "../models/song.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

// add a song to the current user's likedSongs list
// analogous to Spotify's "Save Tracks for User"
// https://developer.spotify.com/documentation/web-api/reference/#/operations/save-tracks-user
// note: we do not yet implement sharing, offline-sync, or playback devices
export const likeSong = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const { songId } = req.params;
		const user = await User.findOne({ clerkId: userId });
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!user.likedSongs.includes(songId)) {
			user.likedSongs.push(songId);
			await user.save();
			// Increment likesCount on the song
			await Song.findByIdAndUpdate(songId, { $inc: { likesCount: 1 } });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

// remove a song from likes
export const unlikeSong = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const { songId } = req.params;
		const user = await User.findOne({ clerkId: userId });
		if (!user) return res.status(404).json({ message: "User not found" });

		user.likedSongs = user.likedSongs.filter((s) => s.toString() !== songId);
		await user.save();
		// Decrement likesCount on the song
		await Song.findByIdAndUpdate(songId, { $inc: { likesCount: -1 } });
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

// fetch songs liked by the current user
export const getLikedSongs = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const user = await User.findOne({ clerkId: userId }).populate("likedSongs");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user.likedSongs);
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getMe = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const user = await User.findOne({ clerkId: userId });
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json({ premium: user.premium });
	} catch (error) {
		console.error(error);
		next(error);
	}
};


