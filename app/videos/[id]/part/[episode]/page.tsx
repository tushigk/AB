import { notFound } from "next/navigation";
import { videos } from "@/components/home/types";

async function getVideoById(id: string) {
  return videos.find((v) => v.id === Number(id)) || null;
}

export default async function VideoWatchPage({
  params,
}: {
  params: { id: string; episode: string };
}) {
  const video = await getVideoById(params.id);
  if (!video) return notFound();

  const episode = Number(params.episode);
  const videoUrl = video.videoUrls?.[episode];
  if (!videoUrl) return notFound();

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center overflow-hidden">
      <video
        src={videoUrl}
        autoPlay
        playsInline
        loop
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-between text-white text-sm">
          <span>@username</span>
          <span>Episode {episode + 1}</span>
        </div>

        <div className="text-white">
          <p className="font-semibold">Video Title</p>
          <p className="text-sm opacity-80">#hashtag #trending</p>
        </div>
      </div>
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 text-white text-center">
        <button className="flex flex-col items-center">
          ❤️
          <span className="text-xs">12.3k</span>
        </button>
        <button className="flex flex-col items-center">
          💬
          <span className="text-xs">340</span>
        </button>
        <button className="flex flex-col items-center">
          ↗️
          <span className="text-xs">Share</span>
        </button>
      </div>
    </div>
  );
}
