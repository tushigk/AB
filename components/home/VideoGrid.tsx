"use client";

import Link from "next/link";
import { PlayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { motion } from "framer-motion";
import { Video } from "./types";

interface VideoGridProps {
  videos: Video[];
  initialCount?: number;
}

export default function VideoGrid({
  videos,
  initialCount = 8,
}: VideoGridProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedVideos = showAll ? videos : videos.slice(0, initialCount);

  return (
    <section className="md:max-w-4/5  mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-heading font-extrabold text-foreground">
          🎬 Сүүлд гарсан
        </h2>
        <Link
          href="/videos"
          className="text-primary hover:underline font-semibold text-lg"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedVideos.map((item, idx) => (
          <motion.div
            key={item._id || idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="relative w-full h-64">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow">
                18+
              </span>
            </div>

            <div className="p-5 bg-background/90 backdrop-blur-md">
              <h3 className="text-lg md:text-xl font-heading font-bold text-foreground line-clamp-2">
                {item.title}
              </h3>
              <p className="text-foreground/70 text-sm mt-1">
                Нийт анги: {item.totalEpisodes}
              </p>

              <div className="mt-4">
                {item.freeEpisodes.length > 0 && (
                  <Link
                    href={`/videos/${item._id}`}
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" /> Үзэх
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!showAll && videos.length > initialCount && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Илүү олон үзэх
          </button>
        </div>
      )}
    </section>
  );
}
