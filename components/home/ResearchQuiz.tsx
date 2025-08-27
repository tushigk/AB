"use client";

import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { QuizType } from "./types";
import { authApi } from "@/apis";
import { motion, AnimatePresence } from "framer-motion";

interface PsychologicalQuizProps {
  quizTypes: QuizType[];
}

export default function PsychologicalQuiz({ quizTypes }: PsychologicalQuizProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    quizId: number | null;
    price: number;
  }>({ open: false, quizId: null, price: 0 });

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const openConfirmModal = (quizId: number, price: number) => {
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
      console.error(err);
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

      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {quizTypes.map((quiz) => {
          const isUnlocked = unlockedQuizzes.includes(quiz.id);

          return (
            <div
              key={quiz.id}
              className="relative bg-background border border-foreground/20 rounded-lg p-4 hover:shadow-lg hover:shadow-primary/20 transition"
            >
              <img
                src={quiz.image}
                alt={quiz.title}
                className="w-full h-72 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {quiz.title}
              </h3>
              <p className="text-foreground/70 mt-2">{quiz.description}</p>

              {isUnlocked ? (
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="mt-4 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                >
                  🔓 Тест нээгдсэн - Үзэх
                </Link>
              ) : (
                <button
                  onClick={() => openConfirmModal(quiz.id, quiz.price)}
                  disabled={loadingId === quiz.id}
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  {loadingId === quiz.id ? "Нээж байна..." : `Нээх (${quiz.price} токен)`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
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
