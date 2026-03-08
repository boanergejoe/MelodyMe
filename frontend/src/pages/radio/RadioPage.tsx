import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Radio, Music } from "lucide-react";

const RadioPage = () => {
    const genres = [
        "Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic",
        "Country", "R&B", "Reggae", "Blues", "Folk", "Indie",
        "Metal", "Punk", "Alternative", "Dance", "Soul", "Funk"
    ];

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Radio className="h-8 w-8" />
                    Radio Stations
                </h1>
                <p className="text-zinc-400">Discover new music with personalized radio stations</p>
            </div>

            <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {genres.map((genre) => (
                        <Card key={genre} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer">
                            <CardHeader className="p-4">
                                <CardTitle className="text-center text-lg">{genre}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <Button className="w-full" variant="outline">
                                    <Music className="h-4 w-4 mr-2" />
                                    Play {genre}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default RadioPage;