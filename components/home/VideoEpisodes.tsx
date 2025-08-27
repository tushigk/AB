"use client";

import { useState } from "react";
import { PlayIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useSWR from "swr";
import { Video } from "./types";
import { authApi } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";

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
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    episode: number | null;
    price: number;
  }>({ open: false, episode: null, price: 0 });

  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const openConfirmModal = (episode: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, episode, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.episode) return;

    const episode = confirmModal.episode;
    const price = confirmModal.price;

    setLoadingEpisode(episode);
    setConfirmModal({ ...confirmModal, open: false });

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

  const handleCancel = () => {
    setConfirmModal({ open: false, episode: null, price: 0 });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: video.episodes }, (_, i) => i + 1).map((episode) => {
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
                    onClick={() => openConfirmModal(episode, price)}
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
        })}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Таны токен: <span className="font-bold">{tokens}</span>
      </div>

      <AnimatePresence>
        {confirmModal.open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Токенээр нээх
                </h3>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Та {confirmModal.price} токен зарцуулж, энэ ангийн нээх гэж байна!
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleConfirmUnlock}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition transform"
                >
                  Баталгаажуулах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
