import { notFound } from "next/navigation";
import Image from "next/image";
import { videos } from "@/components/home/types";
import VideoEpisodes from "@/components/home/VideoEpisodes";

async function getVideoById(id: string) {
  return videos.find((v) => v.id === Number(id)) || null;
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideoById(params.id);
  if (!video) return notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[450px] md:h-[500px] w-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-12">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            {video.title}
          </h1>
          <p className="mt-2 md:mt-3 text-foreground/80 text-lg md:text-xl">
            Нийт анги: {video.episodes}
          </p>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
          Ангиуд 🎬
        </h2>
        <div className="bg-background border border-foreground/20 rounded-2xl shadow-md p-6 hover:shadow-primary/20 transition">
          <VideoEpisodes video={video} />
        </div>
      </div>
    </div>
  );
}
