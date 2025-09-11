"use client";

import { paymentApi } from "@/apis";
import PaymentModal from "@/components/modal/payment";
import { motion } from "framer-motion";
import { useState } from "react";

type Plan = {
  name: string;
  tokens: number;
  totalPriceMNT: number;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  locked?: boolean;
};

const formatMNT = (v: number) => {
  return new Intl.NumberFormat("mn-MN").format(v) + "₮";
}

const plans: Plan[] = [
  {
    name: "Starter",
    tokens: 1,
    totalPriceMNT: 20000,
    description:
      "Эмчээс и-мэйл зөвлөгөө авахад 1 токен зарцуулагдана. Анхны туршилт, яаралгүй асуултад тохиромжтой.",
    features: [
      "1 токен багц",
      "Нэг удаагийн зөвлөгөө",
      "Дундаж хариулах хугацаа: 24 цаг дотор",
    ],
    cta: "Худалдаж авах",
  },
  {
    name: "Professional",
    tokens: 5,
    totalPriceMNT: 60000, 
    description:
      "Идэвхтэй хэрэглэгчдэд хамгийн тохиромжтой. Илүү хямд нэгж үнэ, давтамжтай асуултуудад.",
    features: [
      "5 токен багц",
      "Нэг и-мэйлд 1 токен хасагдана",
      "Дундаж хариулах хугацаа: 24 цаг дотор",
      "Эрэмбэлсэн (priority) и-мэйл ээлж",
    ],
    cta: "Худалдаж авах",
    highlight: true,
  },
  {
    name: "Enterprise",
    tokens: 10,
    totalPriceMNT: 100000, 
    description:
      "Гэр бүл, багуудад зориулав. Хамгийн хямд нэгж үнэ, уян хатан хэрэглээ.",
    features: [
      "10 токен багц",
      "Хамтран ашиглах боломж (гэр бүл/баг)",
      "Дундаж хариулах хугацаа: 24 цаг дотор",
      "Давуу эрхтэй (priority+) и-мэйл",
    ],
    cta: "Борлуулалтын багтай холбогдох",
    locked: false,
  },
];
export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [payment, setPayment] = useState()
  const onBuyToken = async (tokens: number) => {
    setLoading(true);
    setSuccessModalOpen(true);
    try {
      const res = await paymentApi.onPayment(tokens);
      console.log(res);
      setLoading(false)
      setPayment(res);
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="bg-background text-white flex items-center justify-center p-6 h-full min-h-screen">
        <div className="w-full max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plans.map((plan) => {
              const unit = Math.round(plan.totalPriceMNT / plan.tokens);
              return (
                <motion.div
                  key={plan.name}
                  variants={item}
                  whileHover={{ scale: 1.04 }}
                  className={`relative flex flex-col rounded-2xl p-8 border transition-all bg-gradient-to-b from-neutral-900 to-neutral-950 ${plan.highlight
                    ? "border-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "border-neutral-700"
                    }`}
                >
                  {plan.highlight && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-black px-2 py-1 text-xs rounded">
                      Bestseller
                    </span>
                  )}

                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">{plan.description}</p>

                  <div className="mt-6 flex items-end gap-2">
                    <div>
                      <div className="text-4xl font-bold">
                        {formatMNT(plan.totalPriceMNT)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {plan.tokens} токен • ~{formatMNT(unit)}/токен
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className={`mt-6 w-full py-3 rounded-xl font-medium ${plan.highlight
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-neutral-800 hover:bg-neutral-700"
                      }`}
                    onClick={() => onBuyToken(plan.tokens)}
                  >
                    {plan.cta}
                    {plan.locked && <span className="ml-2">🔒</span>}
                  </motion.button>

                  <ul className="mt-6 space-y-2 text-sm text-gray-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✔</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          <p className="text-center text-xs text-gray-500 mt-6">
            * Худалдаж авсан токеныг буцаахгүй
          </p>
        </div>
      </div>
      <PaymentModal
        payment={payment}
        setSuccessModalOpen={setSuccessModalOpen}
        successModalOpen={successModalOpen}
        loading={loading}
      />
    </>
  );
}

