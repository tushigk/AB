"use client";

import { useState } from 'react';
import useSWR from 'swr';
import Footer from '@/components/home/Footer';
import HeroCarousel from '@/components/home/HeroCarousel';
import ReleaseCalendar from '@/components/home/ReleaseCalendar';
import ResearchArticles from '@/components/home/ResearchArticles';
import PsychologicalQuiz from '@/components/home/ResearchQuiz';
import SubscriptionCTA from '@/components/home/Subscription';
import VideoGrid from '@/components/home/VideoGrid';
import { textContent, quizTypes, Video } from '../components/home/types';
import { IDrama } from '@/models/drama';
import { dramaApi } from '@/apis';

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: dramaRes, isLoading } = useSWR<
    { data: IDrama[]; total: number; totalPages: number; currentPage: number }
  >(
    `swr.drama.list.${page}.${search}.${selectedCategory}`,
    async () =>
      dramaApi.getDramas({
        page,
        search,
        // category: selectedCategory
      }),
    { revalidateOnFocus: false }
  );

  const videos = dramaRes?.data?.map((drama) => ({
    id: drama._id,
    title: drama.title,
    description: drama.description,
    thumbnail: drama.image?.url || "/placeholder.jpg",
    episodes: drama.totalEpisodes,
    freeEpisodes: Array.from({ length: drama.freeEpisodes }, (_, i) => i + 1),
    episodePrices: drama.episodePrices || {},
  })) || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HeroCarousel videos={videos} />
      <ReleaseCalendar />
      <VideoGrid videos={videos} />
      <ResearchArticles />
      <PsychologicalQuiz quizTypes={quizTypes} />
      <SubscriptionCTA />
      <Footer />
    </div>
  );
}
