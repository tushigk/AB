"use client";
import Footer from '@/components/home/Footer';
import Header from '@/components/home/Header';
import HeroCarousel from '@/components/home/HeroCarousel';
import ReleaseCalendar from '@/components/home/ReleaseCalendar';
import ResearchArticles from '@/components/home/ResearchArticles';
import PsychologicalQuiz from '@/components/home/ResearchQuiz';
import Sidebar from '@/components/home/SideBar';
import SubscriptionCTA from '@/components/home/Subscription';
import VideoGrid from '@/components/home/VideoGrid';
import { videos, textContent, quizTypes } from '../components/home/types';
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