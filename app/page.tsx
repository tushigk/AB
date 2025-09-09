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
import { Video } from "@/components/home/types";
const ageFetcher = (): boolean | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ageConfirmed") === "true";
};
interface GetDramasParams {
  page: number;
  search?: string;
  categoryId?: string;
}

interface IDramaApiResponse {
  data: {
    _id: string;
    title: string;
    description: string;
    image?: { url: string };
    totalEpisodes: number;
    freeEpisodes: number;
    dramaToken: number;
    episodeToken: number;
    dramaEpisodes?: [];
  }[];
  total: number;
  totalPages: number;
  currentPage: number;
}
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

  const { data: dramaRes, isLoading: isDramaLoading } = useSWR<IDramaApiResponse>(
    ["swr.drama.list", page, search, selectedCategory],
    async () =>
      dramaApi.getDramas({
        page,
        search,
        categoryId: selectedCategory || undefined, 
      } as GetDramasParams),
    { revalidateOnFocus: false }
  );

  const mappedVideos: Video[] =
    dramaRes?.data?.map((item) => ({
      _id: item._id,
      title: item.title,
      description: item.description,
      thumbnail: item.image?.url || "/placeholder.jpg",
      totalEpisodes: item.totalEpisodes,
      freeEpisodes: Array.from({ length: item.freeEpisodes }, (_, i) => i + 1),
      dramaToken: item.dramaToken,
      dramaEpisodes: item.dramaEpisodes || [],
      episodePrices: {},
      episodeToken: item.episodeToken,
    })) || [];

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
      <HeroCarousel videos={mappedVideos} />
      <ReleaseCalendar />
      <VideoGrid videos={mappedVideos} initialCount={mappedVideos.length} />
      <ResearchArticles />
      <PsychologicalQuiz />
      <SubscriptionCTA />
      <Footer />
    </div>
  );
}
