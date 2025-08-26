"use client";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import ReleaseCalendar from '@/components/ReleaseCalendar';
import ResearchArticles from '@/components/ResearchArticles';
import PsychologicalQuiz from '@/components/ResearchQuiz';
import Sidebar from '@/components/SideBar';
import SubscriptionCTA from '@/components/Subscription';
import VideoGrid from '@/components/VideoGrid';
import { videos, textContent, quizTypes } from './../components/types';
import { useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <HeroCarousel videos={videos} />
      <ReleaseCalendar />
      <VideoGrid videos={videos} />
      <ResearchArticles textContent={textContent} />
      <PsychologicalQuiz quizTypes={quizTypes} />
      <SubscriptionCTA />
      <Footer />
    </div>
  );
}