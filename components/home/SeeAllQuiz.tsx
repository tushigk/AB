"use client";

import { useState } from "react";
import { QuizType } from "@/components/home/types";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";
import { authApi } from "@/apis";
import Link from "next/link";

interface SeeAllQuizProps {
  quizzes: QuizType[];
}

export default function SeeAllQuizPage({ quizzes }: SeeAllQuizProps) {
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  if (!quizzes || quizzes.length === 0) return <p>Тестүүд олдсонгүй</p>;

  const handleUnlock = (quizId: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }

    setLoadingId(quizId);
    try {
      setUnlockedQuizzes((prev) => [...prev, quizId]);
      const newUser = { ...user, tokens: tokens - price };
      mutate(newUser, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-full mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-bold">Бүх тестүүд</h1>
          <Link
            href="/"
            className="text-primary hover:underline font-medium"
          >
            Буцах →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {quizzes.map((quiz) => {
            const isUnlocked = unlockedQuizzes.includes(quiz.id);

            return (
              <div
                key={quiz.id}
                className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 group bg-gradient-to-br from-gray-800 via-gray-900 to-black"
              >
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6 relative z-10">
                  <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-indigo-400 transition duration-300">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {quiz.description}
                  </p>

                  {isUnlocked ? (
                    <Link
                  href={`/quizzes/${quiz.id}`}
                  className="mt-4 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                >
                  🔓 Тест нээгдсэн - Үзэх
                </Link>
                  ) : (
                    <button
                      onClick={() => handleUnlock(quiz.id, quiz.price)}
                      disabled={loadingId === quiz.id}
                      className="mt-2 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                    >
                      <LockClosedIcon className="w-5 h-5" />
                      {loadingId === quiz.id ? "Нээж байна..." : `Нээх (${quiz.price} токен)`}
                    </button>
                  )}
                </div>

                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                  Тест
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
