"use client";

import { useState } from "react";
import { PlayIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useSWR from "swr";
import { Video } from "./types";
import { authApi } from "@/apis";
import { purchaseEpisode } from "@/apis/video";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  video: Video;
}

const fetchUser = async () => await authApi.me();

export default function VideoEpisodes({ video }: Props) {
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    episodeId: string | null;
    episodeNumber: number | null;
    price: number;
  }>({ open: false, episodeId: null, episodeNumber: null, price: 0 });

  const { data: user, mutate: mutateUser } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;
  const unlockedEpisodes = user?.unlockedEpisodes || [];

  const openConfirmModal = (
    episodeId: string,
    episodeNumber: number,
    price: number
  ) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, episodeId, episodeNumber, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.episodeId) return;

    const episodeId = confirmModal.episodeId;
    const price = confirmModal.price;

    setLoadingEpisode(episodeId);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      const response = await purchaseEpisode(video._id, episodeId);
      if (response.message === "Анги амжилттай нээгдлээ") {
        await mutateUser();
      } else {
        throw new Error(response.message || "Unlock failed");
      }
    } catch (err: unknown) {
      console.error("Unlock Error:", err);
      alert(
        err instanceof Error
          ? err.message || "Анги нээхэд алдаа гарлаа. Дахин оролдоно уу."
          : "Анги нээхэд алдаа гарлаа. Дахин оролдоно уу."
      );
    } finally {
      setLoadingEpisode(null);
    }
  };

  const handleCancel = () =>
    setConfirmModal({
      open: false,
      episodeId: null,
      episodeNumber: null,
      price: 0,
    });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {video.dramaEpisodes.map((ep) => {
          const isFree = video.freeEpisodes.includes(ep.episodeNumber);
          const isUnlocked = unlockedEpisodes.includes(ep._id);
          const price = video.episodeToken;

          return (
            <div
              key={ep._id}
              className="group relative bg-card rounded-xl overflow-hidden shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="relative w-full aspect-video">
                <img
                  src={
                    // ep.thumbnailUrl || video.thumbnail || 
                    "/image.webp"}
                  alt={`${video.title} - ${ep.episodeNumber}-р анги`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {!isFree && !isUnlocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <LockClosedIcon className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {ep.episodeNumber}-р анги
                </span>

                {isFree || isUnlocked ? (
                  <Link
                    href={`/videos/${video._id}/part/${ep.episodeNumber}`}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:opacity-90 transition"
                  >
                    <PlayIcon className="w-4 h-4" /> Үзэх
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      openConfirmModal(ep._id, ep.episodeNumber, price || 0)
                    }
                    disabled={loadingEpisode === ep._id}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LockClosedIcon className="w-4 h-4" />
                    {loadingEpisode === ep._id
                      ? "Нээж байна..."
                      : `Нээх (${price} токен)`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
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
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Та {confirmModal.price} токен зарцуулж,{" "}
                {confirmModal.episodeNumber}-р ангийг нээх гэж байна!
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
