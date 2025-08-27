"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { useState } from "react";
import PaymentModal from "@/components/modal/payment";
import { textContent } from "@/components/home/types";
import { paymentApi } from "@/apis";

interface Props {
  id: string;
}

export default function ArticlePageClient({ id }: Props) {
  const article = textContent.find((item) => item.id === Number(id));
  if (!article) return notFound();

  const [hasPaid, setHasPaid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.onPayment(article.price);
      res.itemId = article.id; // for modal unlock tracking
      setPayment(res);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:scale-105 transform transition duration-500 group">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-300"></div>

          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-xl"
            />
          )}

          <div className="p-6 relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 group-hover:text-indigo-400 transition duration-300">
              {article.title}
            </h1>
            <p className="text-gray-300 mb-6 text-lg">{article.preview}</p>

            {hasPaid ? (
              <div className="prose prose-invert max-w-full text-lg leading-relaxed">
                <p>{article.fullText}</p>
              </div>
            ) : (
              <button
                onClick={handlePay}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-4 rounded-xl shadow-lg transform hover:scale-105"
              >
                <LockClosedIcon className="w-6 h-6" />
                {loading ? "Бэлтгэж байна..." : `Нээх ${article.price}₮`}
              </button>
            )}
          </div>

          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
            18+
          </div>
        </div>
      </div>

      <PaymentModal
        payment={payment}
        successModalOpen={modalOpen}
        setSuccessModalOpen={setModalOpen}
        loading={loading}
        onPaid={() => setHasPaid(true)}
      />
    </div>
  );
}
