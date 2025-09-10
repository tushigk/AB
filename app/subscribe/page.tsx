"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Plan = {
  id: string;
  title: string;
  priceLabel: string;
  priceCents: number;
  features: string[];
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "monthly",
    title: "Lite",
    priceLabel: "₮29,000 / сар",
    priceCents: 29000,
    features: ["Unlimited access", "HD streaming", "Cancel anytime"],
  },
  {
    id: "team",
    title: "Team",
    priceLabel: "₮79,000 / 3 сар",
    priceCents: 79000,
    features: ["10TB storage", "20 team members", "Commercial rights"],
    badge: "Популяр",
  },
  {
    id: "plus",
    title: "Plus",
    priceLabel: "₮299,000 / жил",
    priceCents: 299000,
    features: ["30TB storage", "100+ members", "Commercial rights"],
  },
];

export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(PLANS[1]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <section className="w-full max-w-5xl p-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Choose the plan
          </h1>
          <p className="text-foreground font-semibold mt-2">Get started now! ↓</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex rounded-full bg-purple-600/20 p-1">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-full font-semibold ${
                billingCycle === "annual"
                  ? "bg-white text-black shadow-md"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Annual
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-semibold ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-md"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <motion.article
              key={plan.id}
              layout
              whileHover={{ y: -8 }}
              className={`flex flex-col bg-white rounded-2xl shadow-xl border hover:shadow-2xl transition overflow-hidden ${
                plan.id === "team" ? "ring-2 ring-purple-600" : ""
              }`}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-black">
                    {plan.title}
                  </h2>
                  {plan.badge && (
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-black">
                    {plan.priceLabel}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {billingCycle === "annual"
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">✔</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      plan.id === "team"
                        ? "bg-gray-700 text-whote hover:bg-gray-200"
                        : "bg-gray-700 text-white hover:bg-gray-200"
                    }`}
                  >
                    {plan.id === selectedPlan?.id
                      ? "Selected"
                      : "Start free trial"}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
