"use client";
import { videos } from "@/components/home/types";
import VideoGrid from "@/components/home/VideoGrid";
import { Search } from "lucide-react";

export default function AllVideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background text-foreground font-sans">
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-16 px-6 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            🎬 Бүх Видео
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Бидний санал болгож буй бүх видеог эндээс үзээрэй. Шинэ, түгээмэл болон хамгийн их үзсэн видеонуудыг сонгоорой.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Видео хайх..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-input bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select className="px-4 py-2 rounded-2xl border border-input bg-card text-sm shadow-sm hover:shadow-md transition">
          <option>Шинэ</option>
          <option>Хамгийн их үзсэн</option>
          <option>Түгээмэл</option>
        </select>
      </div>

      <div className="max-w-full mx-auto px-6 pb-16">
        <VideoGrid videos={videos} initialCount={videos.length} />
      </div>
    </div>
  );
}
