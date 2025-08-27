"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { QuizType } from "./types";
import { authApi } from "@/apis";

interface PsychologicalQuizProps {
  quizTypes: QuizType[];
}

export default function PsychologicalQuiz({ quizTypes }: PsychologicalQuizProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<number[]>([]);

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const handleUnlock = async (quizId: number, price: number) => {
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
                  onClick={() => handleUnlock(quiz.id, quiz.price)}
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
    </section>
  );
}
