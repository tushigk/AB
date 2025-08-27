"use client";
import { useState } from "react";
import { QuizType } from "./types";
import { paymentApi } from "@/apis";
import PaymentModal from "@/components/modal/payment";
import Link from "next/link";

interface PsychologicalQuizProps {
  quizTypes: QuizType[];
}

export default function PsychologicalQuiz({ quizTypes }: PsychologicalQuizProps) {
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  const handleQuizSelect = (quiz: QuizType) => {
    setSelectedQuiz(quiz);
    setQuizStep(1); 
  };

  const handlePayment = async () => {
    if (!selectedQuiz) return;
    setLoading(true);
    try {
      const res = await paymentApi.onPayment(selectedQuiz.price);
      res.itemId = selectedQuiz.id; 
      setPayment(res);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (!selectedQuiz) return;
    if (quizStep - 2 < selectedQuiz.questions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(0);
      setSelectedQuiz(null);
      setPaymentCompleted(false);
    }
  };

  return (
    <section className="md:max-w-4/5 mx-auto py-12 px-12">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
        Өөрийгөө илүү мэдмээр байна уу? 🤔
      </h2>
      <Link
          href="/quizzes"
          className="text-primary hover:underline font-medium"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      {quizStep === 0 ? (
        <div className="bg-background border border-foreground/20 p-6 rounded-lg shadow-md">
          <p className="mb-4 text-foreground/70">Тестийг бөглөөд өөрийгөө нээ!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizTypes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-background border border-foreground/20 p-4 rounded-md hover:bg-foreground/10 transition cursor-pointer"
                onClick={() => handleQuizSelect(quiz)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${quiz.title} quiz`}
              >
                <img src={quiz.image} alt={quiz.title} className="w-full h-72 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-foreground">{quiz.title}</h3>
                <p className="text-sm text-foreground/70">{quiz.description}</p>
                <p className="text-sm font-bold text-primary mt-2">
                  Үнэ: {(quiz.price / 100).toFixed(2)}₮
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : quizStep === 1 && selectedQuiz ? (
        <div className="bg-background border border-foreground/20 p-6 rounded-lg shadow-md text-center">
          <img src={selectedQuiz.image} alt={selectedQuiz.title} className="w-full h-80 object-contain rounded-lg mb-4" />
          <h3 className="text-xl font-heading font-semibold text-foreground">{selectedQuiz.title}</h3>
          <p className="text-foreground/70 mb-4">Үнэ: {(selectedQuiz.price / 100).toFixed(2)}₮</p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition"
            aria-label={`Pay for ${selectedQuiz.title}`}
          >
            {loading ? "Бэлтгэж байна..." : "Төлөх"}
          </button>
          <button
            onClick={() => setQuizStep(0)}
            className="ml-4 text-foreground/70 underline"
            aria-label="Cancel payment"
          >
            Буцах
          </button>
        </div>
      ) : paymentCompleted && selectedQuiz ? (
        <div className="bg-background border border-foreground/20 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            {selectedQuiz.questions[quizStep - 2].question}
          </h3>
          <div className="mt-4">
            <div className="w-full bg-foreground/20 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full"
                style={{ width: `${((quizStep - 1) / selectedQuiz.questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-foreground/70 mt-2">
              Question {quizStep - 1} of {selectedQuiz.questions.length}
            </p>
          </div>
          <img src={selectedQuiz.image} alt={selectedQuiz.title} className="w-full h-80 object-cover rounded-lg mb-4 mt-4" />
          <div className="mt-4 space-y-2">
            {selectedQuiz.questions[quizStep - 2].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(option)}
                className="w-full text-left bg-background border border-foreground/20 p-3 rounded-md hover:bg-foreground/10 transition"
                aria-label={`Select ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <PaymentModal
        payment={payment}
        successModalOpen={modalOpen}
        setSuccessModalOpen={setModalOpen}
        loading={loading}
        onPaid={() => setPaymentCompleted(true)}
      />
    </section>
  );
}
