"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import useSWR from "swr";
import { getBanners } from "@/apis/banner";
import { Banner } from "./types";

export default function HeroCarousel() {
  const { data: banners, isLoading, error } = useSWR("banner", getBanners);

  if (isLoading) return <div className="h-[90vh] flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="h-[90vh] flex items-center justify-center text-red-500">Failed to load banners</div>;

  return (
    <section className="relative w-full h-[90vh] z-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {banners?.map((item: Banner) => (
          <SwiperSlide key={item._id}>
            <div className="relative w-full h-full">
              <img
                src={
                  // item.image?.url || 
                  "/image2.webp"}
                alt={item.title}
                className="w-full h-full object-cover brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
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

                {/* {item.link && ( */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link
                      href={"#"}
                      className="mt-8 inline-block bg-gradient-to-r from-primary to-secondary text-white text-lg font-medium px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-transform"
                      aria-label={`Explore ${item.title}`}
                    >
                      Контент үзэх
                    </Link>
                  </motion.div>
                {/* )} */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
