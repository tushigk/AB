"use client";

import { useState } from "react";
import { QuizType } from "@/components/home/types";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { authApi } from "@/apis";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSurveys } from "@/apis/survey";

export default function SeeAllQuizPage() {
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    quizId: string | null;
    price: number;
  }>({ open: false, quizId: null, price: 0 });
  const [page, setPage] = useState<number>(1);

  const fetchUser = async () => await authApi.me();
  const { data: user, mutate, error: userError } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const { data: quizzesRes, isLoading, error: quizzesError } = useSWR(
    `quizzes.${page}`,
    () => getSurveys({ page })
  );

  const quizzes: QuizType[] = Array.isArray(quizzesRes)
    ? quizzesRes.map((quiz: any) => ({
        ...quiz,
        id: quiz._id, 
        image: quiz.image ? `/images/${quiz.image}.png` : "/images/fallback.png",
      }))
    : Array.isArray(quizzesRes?.data)
    ? quizzesRes.data.map((quiz: any) => ({
        ...quiz,
        id: quiz._id,
        image: quiz.image ? `/images/${quiz.image}.png` : "/images/fallback.png",
      }))
    : [];

  const openConfirmModal = (quizId: string, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, quizId, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.quizId) return;

    const id = confirmModal.quizId;
    const price = confirmModal.price;

    setLoadingId(id);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      setUnlockedQuizzes((prev) => [...prev, id]);
      const newUser = { ...user, tokens: tokens - price };
      mutate(newUser, false);
    } catch (err) {
      console.error("Unlock Error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = () => {
    setConfirmModal({ open: false, quizId: null, price: 0 });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-full mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-bold">Бүх тестүүд</h1>
          <Link href="/" className="text-primary hover:underline font-medium">
            Буцах →
          </Link>
        </div>

        {isLoading ? (
          <p>⏳ Уншиж байна...</p>
        ) : quizzesError ? (
          <p className="text-red-500">Алдаа гарлаа: Тестүүдийг ачаалж чадсангүй.</p>
        ) : quizzes.length === 0 ? (
          <p>Тестүүд олдсонгүй</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {quizzes.map((quiz, idx) => {
              const isUnlocked = unlockedQuizzes.includes(quiz._id); 

              return (
                <motion.div
                  key={`${quiz._id}-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 group bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                >
                  <div className="relative h-64 w-full">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="w-full h-full object-cover"
                      // onError={(e) => {
                      //   e.currentTarget.src = "/images/fallback.png"; // Fallback on error
                      // }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                      Тест
                    </div>
                  </div>

                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-indigo-400 transition duration-300">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                      {quiz.description}
                    </p>

                    {isUnlocked ? (
                      <Link
                        href={`/quizzes/${quiz._id}`} // Use _id for routing
                        className="mt-4 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                      >
                        🔓 Тест нээгдсэн - Үзэх
                      </Link>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(quiz._id, quiz.surveyToken)}
                        disabled={loadingId === quiz._id}
                        className="mt-2 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                      >
                        <LockClosedIcon className="w-5 h-5" />
                        {loadingId === quiz._id ? "Нээж байна..." : `Нээх (${quiz.surveyToken} токен)`}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {quizzes.length > 0 && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Өмнөх
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={quizzes.length < 6} 
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Дараах
            </button>
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
                Та {confirmModal.price} токен зарцуулж, энэ тестийг нээх гэж байна!
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