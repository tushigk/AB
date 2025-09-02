"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { Video } from "./types";

interface HeroCarouselProps {
  videos: Video[];
}

export default function HeroCarousel({ videos }: HeroCarouselProps) {
  return (
    <section className="relative w-full h-[90vh]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {videos.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover brightness-[0.75]"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-6 right-6 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                >
                  18+
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg max-w-3xl"
                >
                  {item.title}
                </motion.h2>

                {item.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-base md:text-lg text-gray-200 max-w-2xl"
                  >
                    {item.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    href={`/videos/${item.id}`}
                    className="mt-8 inline-block bg-gradient-to-r from-primary to-secondary text-white text-lg font-medium px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-transform"
                    aria-label={`Explore ${item.title}`}
                  >
                    Контент үзэх
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
