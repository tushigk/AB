"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { QuizType } from "@/components/home/types";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { getSurvey } from "@/apis/survey";

export default function QuizByIdPage() {
  const params = useParams();
  const quizId = params.id as string;

  const [quizStep, setQuizStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const {
    data: quizRes,
    isLoading,
    error: quizError,
  } = useSWR(`quiz.${quizId}`, () => getSurvey(quizId));

  if (quizError) {
    notFound();
  }

  const quiz: QuizType | null = quizRes
    ? {
        ...(quizRes.data || quizRes),
        id: (quizRes.data || quizRes)._id,
        image: (quizRes.data || quizRes).image
          ? `/images/${(quizRes.data || quizRes).image}.png`
          : "/images/fallback.png",
      }
    : null;

  if (!isLoading && !quiz) {
    notFound();
  }

  const getOptionScore = (
    option: string,
    options: string[],
    surveyTitle: string,
    questionIndex: number
  ) => {
    if (!surveyTitle) return 0;

    if (surveyTitle.includes("MBSSS")) {
      const scores = {
        "① Огт тохирохгүй": 1,
        "② Бага зэрэг": 2,
        "③ Дунд зэрэг": 3,
        "④ Ихэвчлэн үнэн": 4,
        "⑤ Бараг үнэн": 5,
        "⑥ Бүрэн үнэн": 6,
      };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("SSSS")) {
      const scores = {
        "😐 Огт биш": 1,
        "🙂 Бага зэрэг": 2,
        "😏 Ихэвчлэн": 3,
        "🔥 Маш их": 4,
      };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("IIEF")) {
      const scores = {
        "😞 Огт биш": 0,
        "😕 Бараг хэзээ ч үгүй": 1,
        "🧐 Ховор": 2,
        "🙂 Заримдаа": 3,
        "❤️‍🔥 Ихэнхдээ": 4,
        "💯 Байнга / үргэлж": 5,
      };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("FSFI")) {
      const scoresByQuestion = [
        { A: 1, B: 2, C: 3, D: 4, E: 5, F: 5 },
        { A: 1, B: 2, C: 3, D: 4, E: 5, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
      ];
      const optionLetter = option.split(". ")[1];
      return (
        scoresByQuestion[questionIndex]?.[
          optionLetter as keyof (typeof scoresByQuestion)[0]
        ] || 0
      );
    }

    if (surveyTitle.includes("SASI")) {
      const scores = {
        "A. Бүрэн үнэн": 5,
        "B. Хэсэгчлэн үнэн": 4,
        "C. Дунд зэрэг": 3,
        "D. Хэсэгчлэн буруу": 2,
        "E. Бүрэн буруу": 1,
      };
      const reverseScores = {
        "A. Бүрэн үнэн": 1,
        "B. Хэсэгчлэн үнэн": 2,
        "C. Дунд зэрэг": 3,
        "D. Хэсэгчлэн буруу": 4,
        "E. Бүрэн буруу": 5,
      };
      const reverseQuestions = [1, 3, 5, 7, 9];
      return reverseQuestions.includes(questionIndex)
        ? reverseScores[option as keyof typeof reverseScores] || 0
        : scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("SAST")) {
      return option.includes("✅ Тийм") ? 1 : 0;
    }

    return 0;
  };

  const handleAnswer = (option: string, options: string[]) => {
    const value = getOptionScore(option, options, quiz?.title || "", quizStep);
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[quizStep] = value;
      return newAnswers;
    });
    setScore((prev) => prev + value);

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
    setAnswers([]);
  };

  const getResult = () => {
    if (!quiz?.results) return null;

    if (quiz.title.includes("FSFI")) {
      const domainScores = {
        Desire: (answers[0] + answers[1]) * 0.6,
        Arousal: (answers[2] + answers[3] + answers[4] + answers[5]) * 0.3,
        Lubrication: (answers[6] + answers[7] + answers[8] + answers[9]) * 0.3,
        Orgasm: (answers[10] + answers[11] + answers[12]) * 0.4,
        Satisfaction: (answers[13] + answers[14] + answers[15]) * 0.4,
        Pain: (answers[16] + answers[17] + answers[18]) * 0.4,
      };
      const totalScore = Object.values(domainScores).reduce(
        (sum, val) => sum + val,
        0
      );
      return quiz.results.find((result) => {
        const min = Number(result.minScore ?? 0);
        const max = Number(result.maxScore ?? 36);
        return totalScore >= min && totalScore <= max;
      });
    }

    return quiz.results.find((result) => {
      const min = Number(result.minScore ?? 0);
      const max = Number(result.maxScore ?? quiz.questions.length);
      return score >= min && score <= max;
    });
  };

  const getMaxScore = () => {
    if (!quiz) return 0;
    if (quiz.title.includes("MBSSS")) return quiz.questions.length * 6;
    if (quiz.title.includes("SSSS")) return quiz.questions.length * 4;
    if (quiz.title.includes("IIEF")) return quiz.questions.length * 5;
    if (quiz.title.includes("FSFI")) return 36;
    if (quiz.title.includes("SASI")) return quiz.questions.length * 5;
    if (quiz.title.includes("SAST")) return quiz.questions.length;
    return quiz.questions.length * 4;
  };

  const result = completed ? getResult() : null;

  if (isLoading) {
    return (
      <p className="text-center mt-12 text-gray-400">⏳ Ачааллаж байна...</p>
    );
  }

  if (!quiz) {
    return <p className="text-center mt-12 text-red-500">Тест олдсонгүй.</p>;
  }

  return (
    <div className="max-w-3xl md:max-w-3/5 mx-auto py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text bg-gradient-to-r text-secondary animate-gradient-x">
        {quiz.title}
      </h1>

      <motion.img
        src={quiz.image}
        alt={quiz.title}
        className="w-full h-80 md:h-96 object-cover rounded-2xl mb-8 shadow-lg border-4 border-purple-500/30"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="result"
            className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-pink-400">
              Таны үр дүн:
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg">
              Таны оноо:{" "}
              {quiz.title.includes("FSFI") ? score.toFixed(2) : score} /{" "}
              {getMaxScore()}
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
              key={quizStep}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl space-y-6"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Асуулт {quizStep + 1} / {quiz.questions.length}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Оноо: {score}
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {quiz.questions[quizStep].text}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {quiz.questions[quizStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() =>
                      handleAnswer(option, quiz.questions[quizStep].options)
                    }
                    className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-200 to-pink-200 dark:from-gray-700 dark:to-gray-800 hover:border-purple-500 hover:dark:border-pink-500 shadow-md font-semibold transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
