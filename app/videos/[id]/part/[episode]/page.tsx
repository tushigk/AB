"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { dramaApi, authApi,  } from "@/apis";
import { Video } from "@/components/home/types";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { purchaseEpisode } from "@/apis/video";

export default function EpisodePage() {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fallbackSrc, setFallbackSrc] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    episodeId: string | null;
    episodeNumber: number | null;
    price: number;
  }>({ open: false, episodeId: null, episodeNumber: null, price: 0 });

  const { data, isLoading, error } = useSWR<Video>(
    id ? `swr.drama.detail.${id}` : null,
    async () => await dramaApi.getDrama({ id }),
    { revalidateOnFocus: false }
  );

  const { data: user, mutate: mutateUser } = useSWR("userMe", async () => await authApi.me());
  const tokens = user?.tokens || 0;
  const unlockedEpisodes = user?.unlockedEpisodes || [];

  const freeEpisodesArray = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data.freeEpisodes)
      ? data.freeEpisodes
      : Array.from({ length: data.freeEpisodes }, (_, i) => i + 1);
  }, [data]);

  const videoUrlsArray = useMemo(
    () =>
      data?.dramaEpisodes.map((ep) => ep.m3u8Key || ep.videoKey || "") || [],
    [data?.dramaEpisodes]
  );

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

  const videoUrl = fallbackSrc || videoUrlsArray[currentEpisode] || "/video.mp4";

  const handleVideoError = () => setFallbackSrc("/video.mp4");

  const openConfirmModal = (episodeId: string, episodeNumber: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, episodeId, episodeNumber, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.episodeId || !data) return;

    const episodeId = confirmModal.episodeId;
    const price = confirmModal.price;

    setConfirmModal({ ...confirmModal, open: false });

    try {
      const response = await purchaseEpisode(data._id, episodeId);
      if (response.message === "Анги амжилттай нээгдлээ") {
        await mutateUser();
      } else {
        throw new Error(response.message || "Unlock failed");
      }
    } catch (err: unknown) {
      console.error("Unlock Error:", err);
      alert(err instanceof Error ? err.message : "Анги нээхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleCancel = () =>
    setConfirmModal({ open: false, episodeId: null, episodeNumber: null, price: 0 });

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
            const isUnlocked = unlockedEpisodes.includes(ep._id);
            const price = data.episodeToken;

            const canWatch = isFree || isUnlocked;

            return (
              <button
                key={ep._id}
                onClick={() => {
                  if (canWatch) {
                    setFallbackSrc("");
                    setCurrentEpisode(idx);
                  } else {
                    openConfirmModal(ep._id, ep.episodeNumber, price || 0);
                  }
                }}
                className={`relative px-2 py-2 text-sm rounded-lg transition-colors flex items-center justify-center ${
                  idx === currentEpisode
                    ? "bg-white/20 font-bold text-white"
                    : canWatch
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-500 cursor-pointer"
                }`}
              >
                {ep.episodeNumber}
                {!canWatch && (
                  <LockClosedIcon className="w-4 h-4 ml-1 text-gray-400 absolute right-1 top-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Таны токен: <span className="font-bold">{tokens}</span>
        </div>
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
                Та {confirmModal.price} токен зарцуулж, {confirmModal.episodeNumber}-р ангийг нээх гэж байна!
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
    </div>
  );
}
