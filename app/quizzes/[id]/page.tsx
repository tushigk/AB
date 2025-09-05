"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { QuizType } from "@/components/home/types";
import { motion, AnimatePresence } from "framer-motion";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { authApi } from "@/apis";
import useSWR from "swr";

import { getSurvey } from "@/apis/survey";

export default function QuizByIdPage() {
  const params = useParams();
  const quizId = params.id as string; 

  const [quizStep, setQuizStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    quizId: string | null;
    price: number;
  }>({ open: false, quizId: null, price: 0 });
  const [loadingUnlock, setLoadingUnlock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => await authApi.me();
  const { data: user, mutate, error: userError } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const { data: quizRes, isLoading, error: quizError } = useSWR(
    `quiz.${quizId}`,
    () => getSurvey(quizId)
  );

  const quiz: QuizType | null = quizRes
    ? {
        ...quizRes.data,
        id: quizRes.data._id,
        image: quizRes.data.image ? `/images/${quizRes.data.image}.png` : "/images/fallback.png",
      }
    : null;

    useEffect(() => {
    if (quizError) {
      setError("Тест ачааллахад алдаа гарлаа.");
    }
    if (!isLoading && !quiz && !quizError) {
      setError("Тест олдсонгүй.");
    }
  }, [quizError, isLoading, quiz]);

  const openConfirmModal = (quizId: string, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, quizId, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.quizId) return;

    setLoadingUnlock(true);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      setUnlocked(true);
      const newUser = { ...user, tokens: tokens - confirmModal.price };
      mutate(newUser, false);
    } catch (err) {
      console.error("Unlock Error:", err);
      setError("Тест нээхэд алдаа гарлаа.");
    } finally {
      setLoadingUnlock(false);
    }
  };

  const handleCancel = () => {
    setConfirmModal({ open: false, quizId: null, price: 0 });
  };

  const handleAnswer = (option: string) => {
    if (quizStep < (quiz?.questions.length || 0) - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizStep(0);
    setCompleted(false);
  };

  if (isLoading) {
    return <p className="text-center mt-12 text-gray-400">⏳ Ачааллаж байна...</p>;
  }

  if (error || !quiz) {
    return (
      <p className="text-center mt-12 text-red-500">{error || "Тест олдсонгүй."}</p>
    );
  }

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text bg-gradient-to-r text-secondary animate-gradient-x">
        {quiz.title}
      </h1>

      <motion.img
        src={quiz.image}
        alt={quiz.title}
        className="w-full h-80 md:h-96 object-cover rounded-2xl mb-8 shadow-lg border-4 border-purple-500/30"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
        onError={(e) => {
          e.currentTarget.src = "/images/fallback.png"; // Fallback on error
        }}
      />

      {!unlocked ? (
        <motion.button
          onClick={() => openConfirmModal(quiz._id, quiz.surveyToken)}
          disabled={loadingUnlock}
          className="w-full py-4 font-bold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          {loadingUnlock ? "Нээж байна..." : `🔓 Тест эхлүүлэх (${quiz.surveyToken} токен)`}
        </motion.button>
      ) : completed ? (
        <motion.div
          className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-pink-400">
            Таны үр дүн:
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
            Та бүх асуултыг амжилттай бөглөсөн! 🎉
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Дахин эхлүүлэх
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Асуулт {quizStep + 1} / {quiz.questions.length}
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {quiz.questions[quizStep].text}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quiz.questions[quizStep].options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-200 to-pink-200 dark:from-gray-700 dark:to-gray-800 hover:border-purple-500 hover:dark:border-pink-500 shadow-md font-semibold transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

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
                Та <span className="font-semibold">{confirmModal.price}</span> токен зарцуулж, энэ тестийг нээх гэж байна.
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow"
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