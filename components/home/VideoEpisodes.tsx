"use client";

import { useState } from "react";
import { PlayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useSWR from "swr";
import { Video } from "./types";
import { authApi } from "@/apis";

interface Props {
  video: Video;
}

const fetchUser = async () => {
  const res = await authApi.me();
  return res; 
};

export default function VideoEpisodes({ video }: Props) {
  const [loadingEpisode, setLoadingEpisode] = useState<number | null>(null);
  const [unlockedEpisodes, setUnlockedEpisodes] = useState<number[]>([]);

  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const handleUnlock = async (episode: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }

    setLoadingEpisode(episode);
    try {
      setUnlockedEpisodes((prev) => [...prev, episode]);

      const newUser = { ...user, tokens: tokens - price };
      mutate(newUser, false);

    } catch (err) {
      console.error("Failed to unlock episode:", err);
    } finally {
      setLoadingEpisode(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: video.episodes }, (_, i) => i + 1).map(
          (episode) => {
            const isFree = video.freeEpisodes.includes(episode);
            const isUnlocked = unlockedEpisodes.includes(episode);
            const price = video.episodePrices?.[episode] ?? 1; 

            return (
              <div
                key={episode}
                className="group relative bg-card rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="relative h-40 w-full">
                  <img
                    src={video.thumbnail}
                    alt={`${video.title} - ${episode}-р анги`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="font-medium">{episode}-р анги</span>

                  {isFree || isUnlocked ? (
                    <Link
                      href={`/videos/${video.id}/part/${episode}`}
                      className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow hover:opacity-90 transition"
                    >
                      <PlayIcon className="w-4 h-4 mr-1" /> Үзэх
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleUnlock(episode, price)}
                      disabled={loadingEpisode === episode}
                      className="inline-flex items-center bg-gradient-to-r from-secondary to-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow hover:opacity-90 transition"
                    >
                      <LockClosedIcon className="w-4 h-4 mr-1" />
                      {loadingEpisode === episode
                        ? "Нээж байна..."
                        : `Нээх (${price} токен)`}
                    </button>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Таны токен: <span className="font-bold">{tokens}</span>
      </div>
    </>
  );
}
