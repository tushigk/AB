"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { QuizType } from "@/components/home/types";
import { motion } from "framer-motion";
import useSWR from "swr";
import { getSurvey } from "@/apis/survey";

export default function QuizByIdPage() {
  const params = useParams();
  const quizId = params.id as string;

  const [quizStep, setQuizStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data: quizRes, isLoading, error: quizError } = useSWR(
    `quiz.${quizId}`,
    () => getSurvey(quizId)
  );

  const quiz: QuizType | null = quizRes
    ? {
        ...(quizRes.data || quizRes),
        id: (quizRes.data || quizRes)._id,
        image: (quizRes.data || quizRes).image
          ? `/images/${(quizRes.data || quizRes).image}.png`
          : "/images/fallback.png",
      }
    : null;

  useEffect(() => {
    if (quizError) {
      setError("Тест ачааллахад алдаа гарлаа.");
      notFound();
    }
    if (!isLoading && !quiz && !quizError) {
      setError("Тест олдсонгүй.");
      notFound();
    }
  }, [quizError, isLoading, quiz]);

  const handleAnswer = (option: string) => {
    if (option.includes("✅ Тийм")) {
      setScore((prev) => prev + 1);
    }

    if (quizStep < (quiz?.questions.length || 0) - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizStep(0);
    setCompleted(false);
    setScore(0);
  };

  const getResult = () => {
    if (!quiz?.results) return null;
    return quiz.results.find(
      (result) => score >= result.minScore && score <= result.maxScore
    );
  };

  const result = completed ? getResult() : null;

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
          e.currentTarget.src = "/images/fallback.png";
        }}
      />

      {completed ? (
        <motion.div
          className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-pink-400">
            Таны үр дүн:
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg">
            Таны оноо: {score} / {quiz.questions.length}
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
            {result
              ? `${result.label}: ${result.description}`
              : "Үр дүн тодорхойлогдоогүй байна."}
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Дахин эхлүүлэх
          </button>
        </motion.div>
      ) : (
        quiz?.questions?.length > 0 &&
        quizStep < quiz.questions.length && (
          <motion.div
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={quizStep}
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
        )
      )}
    </div>
  );
}