"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { QuizType } from "./types";
import { authApi } from "@/apis";
import { motion } from "framer-motion";
import { getSurveys } from "@/apis/survey";

export default function PsychologicalQuiz() {
  const [page, setPage] = useState<number>(1);

  const fetchUser = async () => await authApi.me();
  const { data: user, error: userError } = useSWR("userMe", fetchUser);
  const purchasedQuizzes = user?.purchasedSurveys || [];

  const {
    data: quizzesRes,
    isLoading,
    error: quizzesError,
  } = useSWR(`quizzes.${page}`, () => getSurveys({ page }));

  const quizTypes: QuizType[] = Array.isArray(quizzesRes?.data)
    ? quizzesRes.data.map((quiz: QuizType) => ({
        ...quiz,
        id: quiz._id,
        image: quiz.image
          ? `/images/${quiz.image}.png`
          : "/images/fallback.png",
      }))
    : [];

  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Өөрийгөө илүү мэдмээр байна уу? 🤔
        </h2>
        <Link
          href="/quizzes"
          className="text-primary hover:underline font-semibold text-lg"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      {isLoading ? (
        <p>⏳ Уншиж байна...</p>
      ) : quizzesError ? (
        <p className="text-red-500">
          Алдаа гарлаа: Тестүүдийг ачаалж чадсангүй.
        </p>
      ) : quizTypes.length === 0 ? (
        <p>Тестүүд олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {quizTypes.map((quiz, idx) => {
            const isUnlocked = purchasedQuizzes.includes(quiz._id);

            return (
              <motion.div
                key={`${quiz._id}-${idx}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col bg-gradient-to-br from-background/80 to-background/50 
             backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden 
             shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform
             h-[380px]"
              >
                <div className="relative h-40 w-full">
                  <img
                    src={quiz.image}
                    alt={quiz.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow">
                    18+
                  </span>
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <h3 className="font-heading font-bold text-foreground text-lg line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/quizzes/${quiz._id}`}
                      className={`mt-4 block w-full font-semibold py-2 rounded-lg shadow-md text-white ${
                        isUnlocked
                          ? "bg-green-500 hover:bg-green-600 items-center justify-center gap-2 flex"
                          : "bg-gradient-to-r from-secondary to-accent hover:opacity-90  flex items-center justify-center gap-2"
                      }`}
                    >
                      {!isUnlocked && <LockClosedIcon className="w-5 h-5" />}
                      {isUnlocked
                        ? "🔓 Нээгдсэн - Үзэх"
                        : `Нээх (${quiz.surveyToken} токен)`}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
