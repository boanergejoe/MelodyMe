import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;

	// new UI states
	shuffle: boolean;
	repeat: "none" | "one" | "all";
	showQueue: boolean;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;

	// new actions
	toggleShuffle: () => void;
	cycleRepeat: () => void;
	addToQueue: (song: Song) => void;
	toggleQueue: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	shuffle: false,
	repeat: "none",
	showQueue: false,

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},

	playNext: () => {
		const { currentIndex, queue, shuffle, repeat } = get();

		// if we are repeating one, just replay the same song
		if (repeat === "one") {
			const song = queue[currentIndex];
			if (song) {
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Playing ${song.title} by ${song.artist}`,
					});
				}
				set({ isPlaying: true });
			}
			return;
		}

		let nextIndex = currentIndex + 1;

		if (shuffle) {
			// pick random index different from current
			if (queue.length > 1) {
				do {
					nextIndex = Math.floor(Math.random() * queue.length);
				} while (nextIndex === currentIndex);
			}
		}

		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		} else if (repeat === "all" && queue.length > 0) {
			// wrap around
			const wrapIndex = shuffle
				? Math.floor(Math.random() * queue.length)
				: 0;
			const nextSong = queue[wrapIndex];
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}
			set({
				currentSong: nextSong,
				currentIndex: wrapIndex,
				isPlaying: true,
			});
		} else {
			set({ isPlaying: false });
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
	},
	playPrevious: () => {
		const { currentIndex, queue, shuffle, repeat } = get();

		if (repeat === "one") {
			const song = queue[currentIndex];
			if (song) set({ isPlaying: true });
			return;
		}

		let prevIndex = currentIndex - 1;

		if (shuffle) {
			if (queue.length > 1) {
				do {
					prevIndex = Math.floor(Math.random() * queue.length);
				} while (prevIndex === currentIndex);
			}
		}

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else if (repeat === "all" && queue.length > 0) {
			const wrapIndex = shuffle
				? Math.floor(Math.random() * queue.length)
				: queue.length - 1;
			const prevSong = queue[wrapIndex];
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}
			set({
				currentSong: prevSong,
				currentIndex: wrapIndex,
				isPlaying: true,
			});
		} else {
			set({ isPlaying: false });
			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
	},
	toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
	cycleRepeat: () =>
		set((state) => ({
			repeat:
				state.repeat === "none"
					? "all"
					: state.repeat === "all"
						? "one"
						: "none",
		})),
	addToQueue: (song: Song) =>
		set((state) => ({ queue: [...state.queue, song] })),
	toggleQueue: () => set((state) => ({ showQueue: !state.showQueue })),
}));
