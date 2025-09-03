"use client";

import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import useSWR from "swr";
import { textContent, TextContent } from "@/components/home/types";
import { authApi } from "@/apis";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getArticles, getCategories } from "@/apis/article";

export default function ArticlesPage() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedArticles, setUnlockedArticles] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    articleId: number | null;
    price: number;
  }>({ open: false, articleId: null, price: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const { data: categoriesRes } = useSWR("articleCategories", getCategories);
  const categories: { id: number; name: string }[] = categoriesRes || [];

  const { data: articlesRes, isLoading } = useSWR(
    `articles.${page}.${selectedCategory}`,
    () => getArticles({ page, search: selectedCategory === "all" ? "" : selectedCategory })
  );

  const articles: TextContent[] = articlesRes?.data || textContent;

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-full mx-auto px-6 py-12">
        <h1 className="text-4xl font-heading font-bold mb-8">Бүх мэдээ мэдээлэл</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === "all"
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            } transition`}
          >
            Бүгд
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === cat.name
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              } transition`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p>⏳ Уншиж байна...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((item: TextContent) => {
              const isUnlocked = unlockedArticles.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:scale-105 transform transition duration-500 group"
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-300"></div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />

                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-indigo-400 transition duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4">{item.preview}</p>

                    {isUnlocked ? (
                      <Link
                        href={`/articles/${item.id}`}
                        className="mt-4 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                      >
                        🔓 Агуулга нээгдсэн - Үзэх
                      </Link>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(item.id, item.price)}
                        disabled={loadingId === item.id}
                        className="mt-4 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                      >
                        <LockClosedIcon className="w-5 h-5" />
                        {loadingId === item.id ? "Нээж байна..." : `Нээх (${item.price} токен)`}
                      </button>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    18+
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Токенээр нээх</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Та {confirmModal.price} токен зарцуулж, энэ нийтлэлийн үзэх гэж байна!
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
