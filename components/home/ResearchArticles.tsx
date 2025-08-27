"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { TextContent } from "./types";
import { authApi } from "@/apis";

interface ResearchArticlesProps {
  textContent: TextContent[];
}

export default function ResearchArticles({ textContent }: ResearchArticlesProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [unlockedArticles, setUnlockedArticles] = useState<number[]>([]);

  const fetchUser = async () => {
    const res = await authApi.me();
    return res;
  };
  const { data: user, mutate } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;

  const handleUnlock = async (itemId: number, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }

    setLoadingId(itemId);
    try {
      setUnlockedArticles((prev) => [...prev, itemId]);
      const newUser = { ...user, tokens: tokens - price };
      mutate(newUser, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Мэдээ мэдээлэл
        </h2>
        <Link
          href="/articles"
          className="text-primary hover:underline font-medium"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {textContent.slice(0, 4).map((item) => {
          const isUnlocked = unlockedArticles.includes(item.id);

          return (
            <div
              key={item.id}
              className="relative bg-background border border-foreground/20 rounded-lg p-4 hover:shadow-lg hover:shadow-primary/20 transition"
            >
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                18+
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-72 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-foreground/70 mt-2">{item.preview}</p>

              {isUnlocked ? (
                <Link
                      href={`/articles/${item.id}`}
                      className="mt-4 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 transition text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105"
                    >
                      🔓 Агуулга нээгдсэн - Үзэх
                    </Link>
              ) : (
                <button
                  onClick={() => handleUnlock(item.id, item.price)}
                  disabled={loadingId === item.id}
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  {loadingId === item.id ? "Нээж байна..." : `Нээх (${item.price} токен)`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
