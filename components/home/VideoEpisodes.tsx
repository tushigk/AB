"use client";

import { useState } from "react";
import { PlayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import PaymentModal from "@/components/modal/payment";
import { Video } from "./types";
import { paymentApi } from "@/apis";

interface Props {
  video: Video;
}

export default function VideoEpisodes({ video }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [loadingEpisode, setLoadingEpisode] = useState<number | null>(null);
  const [unlockedEpisodes, setUnlockedEpisodes] = useState<number[]>([]);

  const handlePay = async (episode: number, price: number) => {
    setLoadingEpisode(episode);
    try {
      const res = await paymentApi.onPayment(price);
      res.itemId = episode; 
      setPayment(res);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
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
                      onClick={() => handlePay(episode, 1000)}
                      disabled={loadingEpisode === episode}
                      className="inline-flex items-center bg-gradient-to-r from-secondary to-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow hover:opacity-90 transition"
                    >
                      <LockClosedIcon className="w-4 h-4 mr-1" />
                      {loadingEpisode === episode
                        ? "Бэлтгэж байна..."
                        : "Нээх (1000₮)"}
                    </button>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      <PaymentModal
        payment={payment}
        successModalOpen={modalOpen}
        setSuccessModalOpen={setModalOpen}
        loading={loadingEpisode !== null}
        onPaid={() => {
          if (payment?.itemId) {
            setUnlockedEpisodes((prev) => [...prev, payment.itemId]);
          }
        }}
      />
    </>
  );
}
