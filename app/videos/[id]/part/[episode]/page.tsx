"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { dramaApi } from "@/apis";
import { Video } from "@/components/home/types";

export default function EpisodePage() {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fallbackSrc, setFallbackSrc] = useState("");

  const { data, isLoading, error } = useSWR<Video>(
    id ? `swr.drama.detail.${id}` : null,
    async () => await dramaApi.getDrama({ id }),
    { revalidateOnFocus: false }
  );

  const freeEpisodesArray = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data.freeEpisodes)
      ? data.freeEpisodes
      : Array.from({ length: data.freeEpisodes }, (_, i) => i + 1);
  }, [data]);

  const videoUrlsArray = useMemo(
    () => data?.dramaEpisodes.map((ep) => ep.m3u8Key || ep.videoKey || "") || [],
    [data?.dramaEpisodes]
  );

  const episodeCount = videoUrlsArray.length;
  const videoUrl = fallbackSrc || videoUrlsArray[currentEpisode] || "/video.mp4";

  useMemo(() => {
    if (data && episode) {
      const epNum = Number(episode);
      const idx = data.dramaEpisodes.findIndex(
        (e) => e.episodeNumber === epNum
      );
      setCurrentEpisode(idx >= 0 ? idx : 0);
    }
  }, [data, episode]);

  if (isLoading) return <p className="p-6">⏳ Уншиж байна...</p>;
  if (error || !data) return notFound();

  const handleVideoError = () => setFallbackSrc("/video.mp4");

  return (
    <div className="bg-black w-screen h-[90vh] flex flex-col lg:flex-row overflow-hidden relative">
      <div className="flex-1 flex justify-center items-center relative w-full lg:w-1/4 h-[90vh]">
        <video
          key={currentEpisode}
          src={videoUrl}
          muted={muted}
          autoPlay={isPlaying}
          controls={false}
          className="w-full lg:w-[40%] h-full object-cover"
          onError={handleVideoError}
        />
      </div>

      <div className="hidden lg:flex flex-col w-1/4 border-l border-gray-800 p-4 overflow-y-auto bg-gray-900/50 h-screen">
        <h2 className="text-white font-bold text-2xl mb-2">{data.title}</h2>
        <p className="text-gray-400 mb-4">{data.description}</p>

        <h3 className="text-white font-semibold mb-2">All Episodes</h3>
        <div className="grid grid-cols-3 gap-2">
          {data.dramaEpisodes.map((ep, idx) => {
            const isFree = freeEpisodesArray.includes(ep.episodeNumber);
            return (
              <button
                key={ep._id}
                onClick={() => {
                  setFallbackSrc("");
                  setCurrentEpisode(idx);
                }}
                disabled={!isFree}
                className={`px-2 py-2 text-sm rounded-lg transition-colors ${
                  idx === currentEpisode
                    ? "bg-white/20 font-bold text-white"
                    : isFree
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {ep.episodeNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
