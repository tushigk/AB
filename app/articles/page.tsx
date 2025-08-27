"use client";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import PaymentModal from "@/components/modal/payment";
import { textContent } from "@/components/home/types";
import { paymentApi } from "@/apis";

export default function ArticlesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedArticles, setUnlockedArticles] = useState<number[]>([]);

  const handlePay = async (itemId: number, price: number) => {
    setLoadingId(itemId);
    try {
      const res = await paymentApi.onPayment(price);
      setPayment(res);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-full mx-auto px-6 py-12">
        <h1 className="text-4xl font-heading font-bold mb-8">
          Бүх мэдээ мэдээлэл
        </h1>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {textContent.map((item) => {
            const isUnlocked = unlockedArticles.includes(item.id);
            return (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:scale-105 transform transition duration-500 group"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-300"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div className="p-6 relative z-10">
                  <h3 className="text-2xl text-white font-bold mb-2 group-hover:text-indigo-400 transition duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {item.preview}
                  </p>

                  {isUnlocked ? (
                    <p className="mt-4 text-green-400 font-semibold animate-pulse">
                      Агуулга нээгдсэн
                    </p>
                  ) : (
                    <button
                      onClick={() => handlePay(item.id, item.price)}
                      disabled={loadingId === item.id}
                      className="mt-4 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                    >
                      <LockClosedIcon className="w-5 h-5" />
                      {loadingId === item.id ? "Бэлтгэж байна..." : `Нээх ${item.price}₮`}
                    </button>
                  )}
                </div>

                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                  18+
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
        onPaid={() => {
          if (payment?.itemId) {
            setUnlockedArticles((prev) => [...prev, payment.itemId]);
          }
        }}
      />
    </div>
  );
}
