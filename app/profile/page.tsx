"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { authApi } from "@/apis";
import { getSurvey, getUserSubmissions } from "@/apis/survey";
import { QuizType } from "@/components/home/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const fetcher = async () => {
  const res = await authApi.me();
  return res;
};

export default function ProfilePage() {
  const { data: user, error: userError, isLoading: userLoading } = useSWR("me", fetcher);
  const [page] = useState(1); 

  const { data: submissionsData, error: submissionsError, isLoading: submissionsLoading } = useSWR(
    `submissions.${page}`,
    () => getUserSubmissions({ page })
  );

  const { data: purchasedQuizzes, error: quizzesError, isLoading: quizzesLoading } = useSWR(
    submissionsData ? `purchasedQuizzes.${page}` : null,
    async () => {
      const submissions = Array.isArray(submissionsData?.data)
        ? submissionsData.data
        : Array.isArray(submissionsData)
        ? submissionsData
        : [];
      const surveyIds = submissions.map((submission: any) => submission.surveyId).filter(Boolean);
      const quizPromises = surveyIds.map((id: string) => getSurvey(id));
      const quizResults = await Promise.all(quizPromises);
      return quizResults.map((res) => ({
        ...(res.data || res),
        id: (res.data || res)._id,
        image: (res.data || res).image
          ? `/images/${(res.data || res).image}.png`
          : "/g",
      }));
    }
  );

  const { data: newsData, error: newsError, isLoading: newsLoading } = useSWR(
    "userNews",
    async () => {
      return [
        { id: "news1", title: "Sample News 1", description: "Health update 1" },
        { id: "news2", title: "Sample News 2", description: "Health update 2" },
      ];
    }
  );

  if (userLoading || submissionsLoading || quizzesLoading || newsLoading) {
    return <p className="text-white text-center mt-12">⏳ Ачааллаж байна...</p>;
  }

  if (userError || submissionsError || quizzesError || newsError) {
    return <p className="text-red-500 text-center mt-12">Алдаа гарлаа: Мэдээлэл ачаалж чадсангүй.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
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
              <p className="text-2xl font-bold">{user?.userRequestCount || 0}</p>
              <p className="text-sm text-gray-200">Авсан тест</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-2xl font-bold">{user?.doctorAnsweredUserCount || 0}</p>
              <p className="text-sm text-gray-200">Авсан мэдээ</p>
            </motion.div>
          </div>
        </motion.div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Миний худалдаж авсан тестүүд</h2>
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
                  <div className="relative h-40 w-full">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      // onError={(e) => {
                      //   e.currentTarget.src = "/images/fallback.png";
                      // }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {quiz.description}
                    </p>
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

        <section>
          <h2 className="text-2xl font-bold mb-6">Миний авсан мэдээ</h2>
          {newsData?.length === 0 ? (
            <p className="text-gray-400">Танд авсан мэдээ байхгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {newsData?.map((news: any, idx: number) => (
                <motion.div
                  key={`${news.id}-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform"
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {news.description}
                    </p>
                    <Link
                      href={`/news/${news.id}`} 
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
      </div>
    </div>
  );
}