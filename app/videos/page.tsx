"use client";

import useSWR from "swr";
import VideoGrid from "@/components/home/VideoGrid";
import { Search } from "lucide-react";
import { useState } from "react";
import { categoryApi } from "@/apis";
import { dramaApi } from "@/apis";
import { ICategory } from "@/models/category";
import { Video } from "@/components/home/types";

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

export default function AllVideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const { data: categoryRes } = useSWR<
    { categories: ICategory[]; total: number; totalPages: number; currentPage: number }
  >(
    "swr.article.category.list",
    async () => categoryApi.getCategorys({ type: "Article" }),
    { revalidateOnFocus: false }
  );

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

  return (
    <div className="min-h-screen  bg-gradient-to-b from-background via-muted/30 to-background text-foreground font-sans">
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-16 px-6 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            🎬 Бүх Видео
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Бидний санал болгож буй бүх видеог эндээс үзээрэй.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Видео хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-input bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-2xl border border-input bg-card text-sm shadow-sm hover:shadow-md transition"
        >
          <option value="">Бүх ангилал</option>
          {categoryRes?.categories?.map((cat: ICategory) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-full mx-auto px-6 pb-16">
        {isDramaLoading ? (
          <p className="text-center text-lg mt-10">⏳ Түр хүлээнэ үү...</p>
        ) : mappedVideos.length ? (
          <VideoGrid videos={mappedVideos} initialCount={mappedVideos.length} />
        ) : (
          <p className="text-center text-lg mt-10">📭 Видео олдсонгүй</p>
        )}
      </div>
    </div>
  );
}
