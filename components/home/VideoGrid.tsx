"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Video } from './types';

interface VideoGridProps {
  videos: Video[];
  initialCount?: number;
}

export default function VideoGrid({ videos, initialCount = 8 }: VideoGridProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedVideos = showAll ? videos : videos.slice(0, initialCount);

  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className='flex items-center justify-between mb-6'>
        {videos.length > initialCount && (
          <>
        <h2 className="text-3xl font-heading font-bold text-foreground">Сүүлд гарсан</h2>
          
          <Link
          href="/videos"
          className="text-primary hover:underline font-medium"
        >
          Бүгдийг үзэх →
        </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedVideos.map((item) => (
          <div key={item.id} className="relative bg-background border border-foreground/20 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition">
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={640}
              height={360}
              className="w-full h-72 object-cover"
            />
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">18+</div>
            <div className="p-4">
              <h3 className="text-xl font-heading font-semibold text-foreground">{item.title}</h3>
              <p className="text-foreground/70">Анги: {item.episodes}</p>
              <div className="mt-2">
                {item.freeEpisodes.includes(1) ? (
                  <Link
                    href={`/videos/${item.id}`}
                    className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                    aria-label={`Watch ${item.title} part 1 for free`}
                  >
                    <PlayIcon className="w-5 h-5 mr-2" /> Үзэх
                  </Link>
                ) : (
                  <button
                    className="inline-flex items-center bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                    aria-label={`Unlock ${item.title} for 1000₮`}
                  >
                    <LockClosedIcon className="w-5 h-5 mr-2" /> 1000₮ нээх
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
