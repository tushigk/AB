"use client";
import Link from 'next/link';

export default function SubscriptionCTA() {
  return (
    <section className="max-w-4/5 mx-auto py-12 px-12 text-center">
      <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Бүх контентыг нээх</h2>
      <p className="text-foreground/70 mb-4">Бүх видео, нийтлэл, тестүүдийн үр дүнд хандах!</p>
      <Link
        href="/subscribe"
        className="bg-gradient-to-r from-accent to-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition"
        aria-label="Subscribe to unlock all content"
      >
        Худалдан авах
      </Link>
    </section>
  );
}