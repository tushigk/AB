"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import VideoEpisodes from "@/components/home/VideoEpisodes";
import { dramaApi } from "@/apis";

export default function VideoDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useSWR(
    id ? `swr.drama.detail.${id}` : null,
    async () => {
      const res = await dramaApi.getDrama({ id: String(id) });
      return res;
    },
    { revalidateOnFocus: false }
  );

  if (isLoading) return <p className="p-6">⏳ Уншиж байна...</p>;
  if (error || !data) return <p className="p-6">❌ Алдаа гарлаа</p>;

  const video = {
    id: data._id,
    title: data.title,
    description: data.description,
    thumbnail: data.image?.url || "/placeholder.jpg",
    episodes: data.totalEpisodes,
    freeEpisodes: Array.from({ length: data.freeEpisodes }, (_, i) => i + 1),
    episodeToken: data.episodeToken || {}, 
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">{video.title}</h1>
      <p className="text-gray-600 mb-6">{video.description}</p>

      <VideoEpisodes video={video} />
    </div>
  );
}
