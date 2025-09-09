"use client";

import { useState } from "react";
import useSWR from "swr";
import Footer from "@/components/home/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import ReleaseCalendar from "@/components/home/ReleaseCalendar";
import ResearchArticles from "@/components/home/ResearchArticles";
import PsychologicalQuiz from "@/components/home/ResearchQuiz";
import SubscriptionCTA from "@/components/home/Subscription";
import VideoGrid from "@/components/home/VideoGrid";
import { IDrama } from "@/models/drama";
import { dramaApi } from "@/apis";

const ageFetcher = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ageConfirmed") === "true";
};

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: isAllowed, mutate: setAgeAllowed } = useSWR("ageConfirmed", ageFetcher);

  const handleAgree = () => {
    localStorage.setItem("ageConfirmed", "true");
    setAgeAllowed(true, { revalidate: false });
  };

  const handleDisagree = () => {
    window.location.href = "https://google.com";
  };

  const { data: dramaRes } = useSWR<
    { data: IDrama[]; total: number; totalPages: number; currentPage: number }
  >(
    isAllowed ? `swr.drama.list.${page}.${search}.${selectedCategory}` : null,
    async () =>
      dramaApi.getDramas({
        page,
        search,
      }),
    { revalidateOnFocus: false }
  );

  const videos =
    dramaRes?.data?.map((drama) => ({
      id: drama._id,
      title: drama.title,
      description: drama.description,
      thumbnail: drama.image?.url || "/placeholder.jpg",
      episodes: drama.totalEpisodes,
      freeEpisodes: Array.from({ length: drama.freeEpisodes }, (_, i) => i + 1),
      episodePrices: drama.episodePrices || {},
    })) || [];

  // still loading localStorage check
  if (isAllowed === undefined) return null;

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">18+ Content</h2>
          <p className="mb-6">
            You must be 18 or older to enter this site. Are you over 18?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleAgree}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Yes, I am 18+
            </button>
            <button
              onClick={handleDisagree}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              No, Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HeroCarousel videos={videos} />
      <ReleaseCalendar />
      <VideoGrid videos={videos} />
      <ResearchArticles />
      <PsychologicalQuiz />
      <SubscriptionCTA />
      <Footer />
    </div>
  );
}
