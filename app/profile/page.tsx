"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { authApi } from "@/apis";
import { Article, QuizType, Video } from "@/components/home/types";
import Link from "next/link";
import { useState } from "react";
import { getSurvey } from "@/apis/survey";
import { getArticleById } from "@/apis/article";
import { getDrama } from "@/apis/video";

const fetcher = async () => await authApi.me();

export default function ProfilePage() {
  const { data: user, error: userError, isLoading: userLoading } = useSWR("me", fetcher);
  const [page] = useState(1); 

  const { data: purchasedQuizzes, error: quizzesError } = useSWR(
    user ? `purchasedQuizzes.${page}` : null,
    async () => {
      const quizPromises = (user.purchasedSurveys || []).map((id: string) => getSurvey(id));
      const results = await Promise.all(quizPromises);
      return results.map((res) => ({
        ...(res.data || res),
        id: (res.data || res)._id,
        image: (res.data || res).image ? `/images/${(res.data || res).image}.png` : "/images/fallback.png",
      }));
    }
  );

  const { data: purchasedArticles, error: articlesError } = useSWR(
    user ? `purchasedArticles.${page}` : null,
    async () => {
      const articlePromises = (user.purchasedArticles || []).map((id: string) => getArticleById(id));
      const results = await Promise.all(articlePromises);
      return results.map((res) => ({
        ...(res.data || res),
        id: (res.data || res)._id,
        image: (res.data || res).image ? `/images/${(res.data || res).image}.png` : "/images/fallback.png",
      }));
    }
  );

  const { data: purchasedDramas, error: dramasError } = useSWR(
    user ? `purchasedDramas.${page}` : null,
    async () => {
      const dramaPromises = (user.purchasedDramas || []).map((id: string) => getDrama({id}));
      const results = await Promise.all(dramaPromises);
      return results.map((res) => ({
        ...(res.data || res),
        id: (res.data || res)._id,
        image: (res.data || res).image ? `/images/${(res.data || res).image}.png` : "/images/fallback.png",
      }));
    }
  );

  if (userLoading) return <p className="text-white text-center mt-12">⏳ Ачааллаж байна...</p>;
  if (userError) return <p className="text-red-500 text-center mt-12">Алдаа гарлаа: Мэдээлэл ачаалж чадсангүй.</p>;

  return (
    <div className="min-h-screen bg-background text-white py-12 px-6 ">
      <div className="md:max-w-4/5  max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12 shadow-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Хэрэглэгч: {user?.username || "Нэр"}
          </h1>
          <div className="flex justify-center gap-8 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-2xl font-bold">{user?.tokens || 0}</p>
              <p className="text-sm text-gray-200">Токен</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-2xl font-bold">{(user?.purchasedSurveys || []).length}</p>
              <p className="text-sm text-gray-200">Авсан тест</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-2xl font-bold">{(user?.purchasedArticles || []).length}</p>
              <p className="text-sm text-gray-200">Авсан мэдээ</p>
            </motion.div>
          </div>
        </motion.div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Миний худалдаж авсан тестүүд</h2>
          {purchasedQuizzes?.length === 0 ? (
            <p className="text-gray-400">Танд худалдаж авсан тест байхгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {purchasedQuizzes?.map((quiz: QuizType, idx: number) => (
                <motion.div
                  key={`${quiz.id}-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
                >
                  <img src={quiz.image} alt={quiz.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-2">{quiz.title}</h3>
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="mt-4 block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-center"
                    >
                      🔓 Үзэх
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Миний авсан мэдээ</h2>
          {purchasedArticles?.length === 0 ? (
            <p className="text-gray-400 text-foreground">Танд авсан мэдээ байхгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {purchasedArticles?.map((article: Article, idx: number) => (
                <motion.div
                  key={`${article._id}-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
                >
                  <img src={article.image.url} alt={article.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-2">{article.title}</h3>
                    <Link
                      href={`/articles/${article._id}`}
                      className="mt-4 block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg text-center"
                    >
                      Унших
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Миний авсан драмууд</h2>
          {purchasedDramas?.length === 0 ? (
            <p className="text-gray-400 text-foreground">Танд авсан драм байхгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {purchasedDramas?.map((drama: Video, idx: number) => (
                <motion.div
                  key={`${drama._id}-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
                >
                  <img src={drama.thumbnail} alt={drama.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-2">{drama.title}</h3>
                    <Link
                      href={`/dramas/${drama._id}`}
                      className="mt-4 block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg text-center"
                    >
                      🎬 Үзэх
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
