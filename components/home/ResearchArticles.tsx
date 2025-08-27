"use client";

import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { TextContent } from "./types";
import { authApi } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchArticlesProps {
  textContent: TextContent[];
}

export default function ResearchArticles({ textContent }: ResearchArticlesProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedArticles, setUnlockedArticles] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    articleId: number | null;
    price: number;
  }>({ open: false, articleId: null, price: 0 });

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const openConfirmModal = (articleId: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, articleId, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.articleId) return;

    const id = confirmModal.articleId;
    const price = confirmModal.price;

    setLoadingId(id);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      setUnlockedArticles((prev) => [...prev, id]);
      const newUser = { ...user, tokens: tokens - price };
      mutate(newUser, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = () => {
    setConfirmModal({ open: false, articleId: null, price: 0 });
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-heading font-extrabold text-foreground">
          📰 Мэдээ мэдээлэл
        </h2>
        <Link
          href="/articles"
          className="text-primary hover:underline font-semibold text-lg"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {textContent.slice(0, 2).map((item, idx) => {
          const isUnlocked = unlockedArticles.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
            >
              <div className="relative h-64 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow">
                  18+
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold text-foreground line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-foreground/70 mt-3 line-clamp-3">
                  {item.preview}
                </p>

                {isUnlocked ? (
                  <Link
                    href={`/articles/${item.id}`}
                    className="mt-6 block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition"
                  >
                    🔓 Агуулга нээгдсэн - Үзэх
                  </Link>
                ) : (
                  <button
                    onClick={() => openConfirmModal(item.id, item.price)}
                    disabled={loadingId === item.id}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-accent text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition"
                  >
                    <LockClosedIcon className="w-5 h-5" />
                    {loadingId === item.id
                      ? "Нээж байна..."
                      : `Нээх (${item.price} токен)`}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {confirmModal.open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Токенээр нээх
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <p className="mb-6 text-gray-700 dark:text-gray-300 text-base">
                Та <span className="font-semibold">{confirmModal.price}</span>{" "}
                токен зарцуулж, энэ нийтлэлийг үзэх гэж байна.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleConfirmUnlock}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Баталгаажуулах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
