"use client";
import Link from "next/link";

export default function SubscriptionCTA() {
  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className="text-center bg-background border border-foreground/20 rounded-2xl shadow-md p-10 hover:shadow-primary/20 transition">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Бүх контентыг нээх 🔑
        </h2>
        <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
          Бүх видео, нийтлэл, тестүүдийн үр дүнд хандах боломжтой!
        </p>
        <Link
          href="/subscribe"
          className="inline-block bg-gradient-to-r from-accent to-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 hover:scale-105 transform transition"
          aria-label="Subscribe to unlock all content"
        >
          Худалдан авах
        </Link>
      </div>
    </section>
  );
}
