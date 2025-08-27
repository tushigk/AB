"use client";

import { useState } from "react";
import { QuizType } from "@/components/home/types";
import PaymentModal from "@/components/modal/payment";
import { paymentApi } from "@/apis";
import { LockClosedIcon } from "@heroicons/react/24/solid";

interface SeeAllQuizProps {
  quizzes: QuizType[];
}

export default function SeeAllQuizPage({ quizzes }: SeeAllQuizProps) {
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  if (!quizzes || quizzes.length === 0) return <p>Тестүүд олдсонгүй</p>;

  const handlePayment = async (quiz: QuizType) => {
    setLoadingId(quiz.id);
    try {
      const res = await paymentApi.onPayment(quiz.price);
      res.itemId = quiz.id;
      setPayment(res);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handlePaid = () => {
    if (payment?.itemId && !unlockedQuizzes.includes(payment.itemId)) {
      setUnlockedQuizzes((prev) => [...prev, payment.itemId]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-full mx-auto px-6 py-12">
        <h1 className="text-4xl font-heading font-bold mb-8">Бүх тестүүд</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {quizzes.map((quiz) => {
            const isUnlocked = unlockedQuizzes.includes(quiz.id);

            return (
              <div
                key={quiz.id}
                className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 group bg-gradient-to-br from-gray-800 via-gray-900 to-black"
              >
                {/* Image */}
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="w-full h-64 object-cover"
                />

                {/* Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-indigo-400 transition duration-300">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {quiz.description}
                  </p>

                  {isUnlocked ? (
                    <p className="mt-4 text-green-400 font-semibold animate-pulse text-center">
                      Тест нээгдсэн
                    </p>
                  ) : (
                    <button
                      onClick={() => handlePayment(quiz)}
                      disabled={loadingId === quiz.id}
                      className="mt-2 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                    >
                      <LockClosedIcon className="w-5 h-5" />
                      {loadingId === quiz.id ? "Бэлтгэж байна..." : `Нээх ${quiz.price}₮`}
                    </button>
                  )}
                </div>

                {/* Tag */}
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                  Тест
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PaymentModal
        payment={payment}
        successModalOpen={modalOpen}
        setSuccessModalOpen={setModalOpen}
        loading={loadingId !== null}
        onPaid={handlePaid}
      />
    </div>
  );
}
