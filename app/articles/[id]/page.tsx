"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { getArticleById } from "@/apis/article";
import { Article } from "@/components/home/types";

export default function ArticlePageClient() {
  const params = useParams();
  const articleId = params.id as string;

  const [error, setError] = useState<string | null>(null);

  const { data: articleRes, isLoading, error: swrError } = useSWR(
    `article.${articleId}`,
    () => getArticleById(articleId)
  );

  const article: Article | null = articleRes
    ? {
        ...articleRes,
        id: articleRes._id,
        image: articleRes.image?.url || "/images/fallback.png",
      }
    : null;

  if (swrError) {
    setError("Нийтлэл ачааллахад алдаа гарлаа.");
    notFound();
  }

  if (!isLoading && !article && !swrError) {
    setError("Нийтлэл олдсонгүй.");
    notFound();
  }

  if (isLoading) {
    return <p className="text-center mt-12 text-gray-400">⏳ Ачааллаж байна...</p>;
  }

  if (error || !article) {
    return (
      <p className="text-center mt-12 text-red-500">{error || "Нийтлэл олдсонгүй."}</p>
    );
  }

  return (
    <div className="max-w-3xl md:max-w-5xl mx-auto py-12 px-6">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text bg-gradient-to-r text-secondary animate-gradient-x"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {article.title}
      </motion.h1>

      {article.image && (
        <motion.img
          src={article.image.url}
          alt={article.title}
          className="w-full h-80 md:h-96 object-cover rounded-2xl mb-8 shadow-lg border-4 border-purple-500/30"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      )}

      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {article.category && (
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
            {article.category}
          </p>
        )}

        {article.description ? (
          <div
            className="prose prose-lg prose-invert max-w-full leading-relaxed text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
        ) : (
          <p className="text-gray-500 italic">Агуулга одоогоор байхгүй байна.</p>
        )}
      </motion.div>
    </div>
  );
}
