import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";


const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();
	const { initializeQueue } = usePlayerStore();
	const [search, setSearch] = useState("");

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	// Filter songs by search
	const filterSongs = (songs: typeof featuredSongs) =>
		songs.filter(
			(s) =>
				s.title.toLowerCase().includes(search.toLowerCase()) ||
				s.artist.toLowerCase().includes(search.toLowerCase())
		);

	return (
		<main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
			<Topbar search={search} setSearch={setSearch} />
			<ScrollArea className="h-[calc(100vh-180px)]">
				<div className="p-2 sm:p-6">
					<h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your vibe, your way</h1>
					<FeaturedSection />
					<div className="space-y-8">
						<SectionGrid title="Made For You" songs={filterSongs(madeForYouSongs)} isLoading={isLoading} showAll />
						<SectionGrid title="Trending" songs={filterSongs(trendingSongs)} isLoading={isLoading} showAll />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
