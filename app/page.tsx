"use client";
import Footer from '@/components/home/Footer';
import HeroCarousel from '@/components/home/HeroCarousel';
import ReleaseCalendar from '@/components/home/ReleaseCalendar';
import ResearchArticles from '@/components/home/ResearchArticles';
import PsychologicalQuiz from '@/components/home/ResearchQuiz';
import SubscriptionCTA from '@/components/home/Subscription';
import VideoGrid from '@/components/home/VideoGrid';
import { videos, textContent, quizTypes } from '../components/home/types';

export default function Home() {


  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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