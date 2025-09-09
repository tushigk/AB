"use client";

import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import useSWR from "swr";
import { authApi, categoryApi } from "@/apis";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getArticles, purchaseArticle } from "@/apis/article";
import { Article } from "@/components/home/types";
import { ICategory } from "@/models/category";

export default function ArticlesPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    articleId: string | null;
    price: number;
  }>({ open: false, articleId: null, price: 0 });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const fetchUser = async () => await authApi.me();
  const { data: user, mutate: mutateUser } = useSWR("userMe", fetchUser);
  const tokens = user?.tokens || 0;
  const purchasedArticles = user?.purchasedArticles || [];

  const { data: categoryRes } = useSWR<
    { categories: ICategory[]; total: number; totalPages: number; currentPage: number }
  >(
    `swr.article.category.list`,
    async () => categoryApi.getCategorys({ type: "Article" }),
    { revalidateOnFocus: false }
  );

  const { data: articlesRes, isLoading, error: articlesError } = useSWR(
    `articles.${page}.${selectedCategory}`,
    () => getArticles({ page, search: selectedCategory === "all" ? "" : selectedCategory })
  );
  const articles: Article[] = articlesRes?.data || [];

  const openConfirmModal = (articleId: string, price: number) => {
    if (tokens < price) {
      alert("Таны токен хүрэлцэхгүй байна!");
      return;
    }
    setConfirmModal({ open: true, articleId, price });
  };

  const handleConfirmUnlock = async () => {
    if (!confirmModal.articleId) return;
    const id = confirmModal.articleId;
    const price = confirmModal.price;

    setLoadingId(id);
    setConfirmModal({ ...confirmModal, open: false });

    try {
      const response = await purchaseArticle(id);
      if (response.message === "Нийтлэл амжилттай худалдаж авлаа") {
        await mutateUser(); 
      } else {
        throw new Error(response.message || "Purchase failed");
      }
    } catch (err: unknown) {
      console.error("Unlock Error:", err);
      if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
        alert(
          (err as { message: string }).message === "Та энэ нийтлэлийг аль хэдийн худалдаж авсан байна"
            ? "Энэ нийтлэл аль хэдийн нээгдсэн байна."
            : "Нийтлэл нээхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      } else {
        alert("Нийтлэл нээхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = () =>
    setConfirmModal({ open: false, articleId: null, price: 0 });

  return (
    <section className="md:max-w-4/5  mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          📰 Бүх мэдээ мэдээлэл
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-secondary to-accent text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          } transition`}
        >
          Бүгд
        </button>
        {categoryRes?.categories?.map((cat: ICategory) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedCategory === cat.name
                ? "bg-gradient-to-r from-secondary to-accent text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            } transition`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>⏳ Уншиж байна...</p>
      ) : articlesError ? (
        <p className="text-red-500">
          Алдаа гарлаа: Нийтлэлүүдийг ачаалж чадсангүй.
        </p>
      ) : articles.length === 0 ? (
        <p>Нийтлэлүүд олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item, idx) => {
            const isUnlocked = purchasedArticles.includes(item._id);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow">
                    18+
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 mt-3 line-clamp-3">
                    {item.description}
                  </p>

                  {isUnlocked ? (
                    <Link
                      href={`/articles/${item._id}`}
                      className="mt-6 block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                    >
                      🔓 Агуулга нээгдсэн - Үзэх
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        openConfirmModal(item._id, item.articleToken || 0)
                      }
                      disabled={loadingId === item._id}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-accent text-white font-semibold py-3 rounded-xl shadow-lg"
                    >
                      <LockClosedIcon className="w-5 h-5" />
                      {loadingId === item._id
                        ? "Нээж байна..."
                        : `Нээх (${item.articleToken} токен)`}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {confirmModal.open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Токенээр нээх
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="mb-6 text-gray-700 dark:text-gray-300 text-base">
                Та <span className="font-semibold">{confirmModal.price}</span>{" "}
                токен зарцуулж, энэ нийтлэлийг үзэх гэж байна.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleConfirmUnlock}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow"
                >
                  Баталгаажуулах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
