"use client";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { motion } from "framer-motion";
import { Video } from "./types";

interface VideoGridProps {
  videos: Video[];
  initialCount?: number;
}

export default function VideoGrid({ videos, initialCount = 8 }: VideoGridProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedVideos = showAll ? videos : videos.slice(0, initialCount);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-10">
        
        {videos.length > initialCount && (
          <>
          <h2 className="text-4xl font-heading font-extrabold text-foreground">
          🎬 Сүүлд гарсан
        </h2>
          <Link
            href="/videos"
            className="text-primary hover:underline font-semibold text-lg"
          >
            Бүгдийг үзэх →
          </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedVideos.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                Анги: {item.episodes}
              </p>

              <div className="mt-4">
                {item.freeEpisodes.includes(1) ? (
                  <Link
                    href={`/videos/${item.id}`}
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                    aria-label={`Watch ${item.title} part 1 for free`}
                  >
                    <PlayIcon className="w-5 h-5 mr-2" /> Үзэх
                  </Link>
                ) : (
                  <button
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-secondary to-accent text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
                    aria-label={`Unlock ${item.title} for 1000₮`}
                  >
                    <LockClosedIcon className="w-5 h-5 mr-2" /> 1000₮ нээх
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
