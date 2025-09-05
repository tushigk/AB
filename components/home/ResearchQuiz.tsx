"use client";

import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { QuizType } from "./types";
import { authApi } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";
import { getSurveys } from "@/apis/survey";

export default function PsychologicalQuiz() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<string[]>([]);
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

  const quizTypes: QuizType[] = Array.isArray(quizzesRes)
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
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Өөрийгөө илүү мэдмээр байна уу? 🤔
        </h2>
        <Link
          href="/quizzes"
          className="text-primary hover:underline font-medium"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      {isLoading ? (
        <p>⏳ Уншиж байна...</p>
      ) : quizzesError ? (
        <p className="text-red-500">Алдаа гарлаа: Тестүүдийг ачаалж чадсангүй.</p>
      ) : quizTypes.length === 0 ? (
        <p>Тестүүд олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {quizTypes.map((quiz, idx) => {
            const isUnlocked = unlockedQuizzes.includes(quiz._id);

            return (
              <motion.div
                key={`${quiz._id}-${idx}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
              >
                <div className="relative h-40 w-full">
                  <img
                    src={quiz.image}
                    alt={quiz.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    // onError={(e) => {
                    //   e.currentTarget.src = "/images/fallback.png";
                    // }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow">
                    18+
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-foreground text-lg line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                    {quiz.description}
                  </p>

                  {isUnlocked ? (
                    <Link
                      href={`/quizzes/${quiz._id}`}
                      className="mt-4 block w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-2 rounded-lg shadow-md"
                    >
                      🔓 Нээгдсэн - Үзэх
                    </Link>
                  ) : (
                    <button
                      onClick={() => openConfirmModal(quiz._id, quiz.surveyToken)}
                      disabled={loadingId === quiz._id}
                      className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
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
    </section>
  );
}