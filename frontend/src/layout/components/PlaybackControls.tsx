// UI primitives and hooks imported from shared component library
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// central Zustand store for player state/actions
import { usePlayerStore } from "@/stores/usePlayerStore";

// icons used in playback controls
import {
	Laptop2,
	ListMusic,
	Mic2,
	Pause,
	Play,
	Repeat,
	Repeat1,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume1,
} from "lucide-react";

// React hooks for lifecycle and refs
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

// dialog components for displaying the queue
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// toast notifications for user feedback
import toast from "react-hot-toast";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	// auth status for guarding playback
	const { user, isLoaded } = useUser();
	const isLoggedIn = isLoaded && !!user;

	// destructure needed values and actions from player store
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious, shuffle, toggleShuffle, repeat, cycleRepeat, queue, showQueue, toggleQueue } = usePlayerStore();

	// local component state: volume slider, time/duration display
	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	// ref holds <audio> element so we can inspect/seek it
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			usePlayerStore.getState().playNext();
		};

		audio.addEventListener("ended", handleEnded);

		// Media Session API for mobile/Android notification controls
		if ("mediaSession" in navigator && currentSong) {
			navigator.mediaSession.metadata = new globalThis.MediaMetadata({
				title: currentSong.title,
				artist: currentSong.artist,
				artwork: [
					{ src: currentSong.imageUrl, sizes: "512x512", type: "image/png" },
				],
			});
			navigator.mediaSession.setActionHandler("previoustrack", playPrevious);
			navigator.mediaSession.setActionHandler("play", togglePlay);
			navigator.mediaSession.setActionHandler("pause", togglePlay);
			navigator.mediaSession.setActionHandler("nexttrack", playNext);
		}

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
			if ("mediaSession" in navigator) {
				navigator.mediaSession.setActionHandler("previoustrack", null);
				navigator.mediaSession.setActionHandler("play", null);
				navigator.mediaSession.setActionHandler("pause", null);
				navigator.mediaSession.setActionHandler("nexttrack", null);
			}
		};
	}, [currentSong, playNext, playPrevious, togglePlay]);

	// helper: respond to slider change by seeking audio
	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	// user clicked the shuffle icon; update store and toast accordingly
	const handleShuffleClick = () => {
		const newVal = !shuffle;
		toggleShuffle();
		// toast based on new state (not on mount or programmatic change)
		toast(newVal ? "Shuffle enabled" : "Shuffle disabled");
	};

	// user clicked the repeat icon; compute next label and update
	const handleRepeatClick = () => {
		let message = "";
		switch (repeat) {
			case "none":
				message = "Repeat all";
				break;
			case "all":
				message = "Repeat one";
				break;
			case "one":
				message = "Repeat off";
				break;
		}
		cycleRepeat();
		toast(message);
	};

	return (
		<>
			{/** queue dialog */}
			<Dialog open={showQueue} onOpenChange={toggleQueue}>
				<DialogContent className='bg-zinc-900 border-zinc-800'>
					<DialogHeader>
						<DialogTitle>Upcoming songs</DialogTitle>
					</DialogHeader>
					<div className='space-y-2 max-h-[60vh] overflow-auto'>
						{queue.length === 0 ? (
							<p className='text-zinc-400'>Queue is empty</p>
						) : (
							queue.map((s) => (
								<button
									key={s._id}
									className='w-full text-left p-2 hover:bg-zinc-800 rounded cursor-pointer bg-transparent border-none text-inherit'
									onClick={() => {
										usePlayerStore.getState().setCurrentSong(s);
										setTimeout(toggleQueue, 0);
									}}
								>
									{s.title} - {s.artist}
								</button>
							))
						)}
					</div>
					<DialogTrigger asChild>
						<button className='hidden' />
					</DialogTrigger>

				</DialogContent>
			</Dialog>
			<footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-2 sm:px-4'>
				<div className='flex flex-col sm:flex-row justify-between items-center h-full max-w-[1800px] mx-auto'>
					{/* currently playing song (hidden on small screens to save space) */}
					<div className='hidden sm:flex items-center gap-4 min-w-[120px] w-[30%]'>
						{currentSong && (
							<>
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-14 h-14 object-cover rounded-md'
								/>
								<div className='flex-1 min-w-0'>
									<div className='font-medium truncate hover:underline cursor-pointer'>
										{currentSong.title}
									</div>
									<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
										{currentSong.artist}
									</div>
								</div>
							</>
						)}
					</div>

					{/* player controls*/}
					<div className='flex flex-col items-center gap-2 flex-1 max-w-full'>					{/* central controls area */}						<div className='flex flex-wrap items-center gap-4 sm:gap-6 justify-center'>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex text-zinc-400 ${shuffle ? "text-white" : "hover:text-white"}`}
							onClick={handleShuffleClick}

						>
							<Shuffle className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playPrevious}

						>
							<SkipBack className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-10 w-10 sm:h-8 sm:w-8'
							onClick={togglePlay}

						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}

						>
							<SkipForward className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex text-zinc-400 ${repeat === 'none' ? 'hover:text-white' : 'text-white'}`}
							onClick={handleRepeatClick}

						>
							{repeat === 'one' ? <Repeat1 className='h-4 w-4' /> : <Repeat className='h-4 w-4' />}
						</Button>
						<div className='flex items-center gap-2 w-full justify-center'>
							{/* always show times on all screen sizes; limit slider width on narrow viewports */}
							<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								className='w-full max-w-[500px] hover:cursor-grab active:cursor-grabbing'
								onValueChange={(val) => { if (isLoggedIn) handleSeek(val); else toast.error("Login and listen to your favorite song"); }}
							/>
							<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
						</div>
					</div>

					</div>
					<div className='hidden sm:flex items-center gap-4 min-w-[120px] w-[30%] justify-end'>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400' onClick={() => {
							// microphone icon clicked (no toast)
						}}>
							<Mic2 className='h-4 w-4' />
						</Button>
						<Button size='icon' variant='ghost' className={`hover:text-white text-zinc-400 ${queue.length > 0 ? 'text-white' : ''}`} onClick={toggleQueue}>
							<ListMusic className='h-4 w-4' />
						</Button>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400' onClick={() => {
							// future device selector support
						}}>
							<Laptop2 className='h-4 w-4' />
						</Button>

						<div className='flex items-center gap-2'>
							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
								<Volume1 className='h-4 w-4' />
							</Button>

							<Slider
								value={[volume]}
								max={100}
								step={1}
								className='w-24 hover:cursor-grab active:cursor-grabbing'
								onValueChange={(value) => {
									setVolume(value[0]);
									if (audioRef.current) {
										audioRef.current.volume = value[0] / 100;
									}
								}}
							/>
						</div>
					</div>

				</div>
			</footer>
		</>
	);
};



