"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import { Video } from './types';

interface HeroCarouselProps {
  videos: Video[];
}

export default function HeroCarousel({ videos }: HeroCarouselProps) {
  return (
    <section className="py-12 px-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000 }}
        className="max-w-4/5 mx-auto rounded-xl overflow-hidden"
      >
        {videos.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-120">
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                <div className="text-center">
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">18+</div>
                  <Link
                    href={`/videos/${item.id}`}
                    className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition"
                    aria-label={`Explore ${item.title}`}
                  >
                    Контент үзэх
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}