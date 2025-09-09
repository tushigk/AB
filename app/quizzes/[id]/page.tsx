"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { getSurvey, purchaseSurvey } from "@/apis/survey";
import { authApi } from "@/apis";
import { QuizType } from "@/components/home/types";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; price: number; quizId: string | null }>({ open: false, price: 0, quizId: null });

  const { data: user, mutate: mutateUser } = useSWR("userMe", async () => await authApi.me());
  const tokens = user?.tokens || 0;
  const purchasedQuizzes = user?.purchasedSurveys || [];

  const { data, error, isLoading } = useSWR<QuizType>(id ? `swr.quiz.detail.${id}` : null, async () => await getSurvey(id as string), { revalidateOnFocus: false });

  if (isLoading) return <p className="p-6">⏳ Ачааллаж байна...</p>;
  if (error || !data) return <p className="p-6 text-red-500">❌ Алдаа гарлаа</p>;

  const quiz: QuizType = { ...data, image: data.image ? `/images/${data.image}.png` : "/images/fallback.png" };
  const isPurchased = quiz.isPurchased || purchasedQuizzes.includes(quiz._id);

  const openConfirmModal = () => {
    if (tokens < quiz.surveyToken) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, price: quiz.surveyToken, quizId: quiz._id });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.quizId) return;

    setLoading(true);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      const response = await purchaseSurvey(confirmModal.quizId);
      if (response.message === "Судалгаа амжилттай худалдаж авлаа") {
        await mutateUser();
      } else {
        throw new Error(response.message || "Purchase failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(message === "Та энэ судалгааг аль хэдийн худалдаж авсан байна" ? "Энэ тест аль хэдийн нээгдсэн байна." : "Тест нээхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setConfirmModal({ open: false, price: 0, quizId: null });

  const getOptionScore = (option: string, options: string[], surveyTitle: string, questionIndex: number) => {
    if (!surveyTitle) return 0;

    if (surveyTitle.includes("MBSSS")) {
      const scores = { "① Огт тохирохгүй": 1, "② Бага зэрэг": 2, "③ Дунд зэрэг": 3, "④ Ихэвчлэн үнэн": 4, "⑤ Бараг үнэн": 5, "⑥ Бүрэн үнэн": 6 };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("SSSS")) {
      const scores = { "😐 Огт биш": 1, "🙂 Бага зэрэг": 2, "😏 Ихэвчлэн": 3, "🔥 Маш их": 4 };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("IIEF")) {
      const scores = { "😞 Огт биш": 0, "😕 Бараг хэзээ ч үгүй": 1, "🧐 Ховор": 2, "🙂 Заримдаа": 3, "❤️‍🔥 Ихэнхдээ": 4, "💯 Байнга / үргэлж": 5 };
      return scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("FSFI")) {
      const scoresByQuestion = [
        { A: 1, B: 2, C: 3, D: 4, E: 5, F: 5 }, { A: 1, B: 2, C: 3, D: 4, E: 5, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
        { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }, { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 },
      ];
      const optionLetter = option.split(". ")[1];
      return scoresByQuestion[questionIndex]?.[optionLetter as keyof (typeof scoresByQuestion)[0]] || 0;
    }

    if (surveyTitle.includes("SASI")) {
      const scores = { "A. Бүрэн үнэн": 5, "B. Хэсэгчлэн үнэн": 4, "C. Дунд зэрэг": 3, "D. Хэсэгчлэн буруу": 2, "E. Бүрэн буруу": 1 };
      const reverseScores = { "A. Бүрэн үнэн": 1, "B. Хэсэгчлэн үнэн": 2, "C. Дунд зэрэг": 3, "D. Хэсэгчлэн буруу": 4, "E. Бүрэн буруу": 5 };
      const reverseQuestions = [1, 3, 5, 7, 9];
      return reverseQuestions.includes(questionIndex) ? reverseScores[option as keyof typeof reverseScores] || 0 : scores[option as keyof typeof scores] || 0;
    }

    if (surveyTitle.includes("SAST")) {
      return option.includes("✅ Тийм") ? 1 : 0;
    }

    return 0;
  };

  const handleAnswer = (option: string, options: string[]) => {
    const value = getOptionScore(option, options, quiz?.title || "", quizStep);
    setAnswers(prev => { const newAnswers = [...prev]; newAnswers[quizStep] = value; return newAnswers; });
    setScore(prev => prev + value);

    if (quizStep < (quiz?.questions.length || 0) - 1) setQuizStep(prev => prev + 1);
    else setCompleted(true);
  };

  const handleRestart = () => {
    setQuizStep(0);
    setCompleted(false);
    setScore(0);
    setAnswers([]);
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
      const totalScore = Object.values(domainScores).reduce((sum, val) => sum + val, 0);
      return quiz.results.find(result => totalScore >= Number(result.minScore ?? 0) && totalScore <= Number(result.maxScore ?? 36));
    }

    return quiz.results.find(result => score >= Number(result.minScore ?? 0) && score <= Number(result.maxScore ?? quiz.questions.length));
  };

  const result = completed ? getResult() : null;

  return (
    <section className="md:max-w-4/5 mx-auto py-10 px-6">
      <div className="relative mb-6">
        <img src={quiz.image} alt={quiz.title} className="w-full h-64 object-cover rounded-2xl" />
        <span className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full shadow">18+</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="mb-6">{quiz.description}</p>

      {isPurchased ? (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div key="result" className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-pink-400">Таны үр дүн:</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg">Таны оноо: {quiz.title.includes("FSFI") ? score.toFixed(2) : score} / {getMaxScore()}</p>
                <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">{result ? `${result.label}: ${result.description}` : "Үр дүн тодорхойлогдоогүй байна."}</p>
                {/* <button onClick={handleRestart} className="px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform">Дахин эхлүүлэх</button> */}
              </motion.div>
            ) : (
              quiz?.questions?.length > 0 &&
              quizStep < quiz.questions.length && (
                <motion.div key={quizStep} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl space-y-6"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Асуулт {quizStep + 1} / {quiz.questions.length}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Оноо: {score}</p>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{quiz.questions[quizStep].text}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {quiz.questions[quizStep].options.map((option, idx) => (
                      <motion.button key={idx} onClick={() => handleAnswer(option, quiz.questions[quizStep].options)}
                        className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-200 to-pink-200 dark:from-gray-700 dark:to-gray-800 hover:border-purple-500 hover:dark:border-pink-500 shadow-md font-semibold transition-all text-white"
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
      ) : (
        <button onClick={openConfirmModal} disabled={loading} className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-accent text-white font-semibold py-3 rounded-xl shadow-lg">
          <LockClosedIcon className="w-5 h-5" /> {loading ? "Нээж байна..." : `Нээх (${quiz.surveyToken} токен)`}
        </button>
      )}

      <AnimatePresence>
        {confirmModal.open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Токенээр нээх</h3>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300">Та {confirmModal.price} токен зарцуулж, энэ тестийг нээх гэж байна!</p>
              <div className="flex justify-end gap-3">
                <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Цуцлах</button>
                <button onClick={handleConfirmUnlock} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition transform">Баталгаажуулах</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
