"use client";

import { notFound } from "next/navigation";
import { videos } from "@/components/home/types";
import { useState, useRef, useEffect } from "react";
import { use } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Heart,
  Share2,
  Star,
  Volume2,
  VolumeX,
  Maximize,
  Repeat,
} from "lucide-react";
import { Divider } from "antd";

function getVideoById(id: string) {
  return videos.find((v) => v.id === Number(id)) || null;
}

export default function VideoWatchPage({
  params,
}: {
  params: Promise<{ id: string; episode: string }>;
}) {
  const { id, episode } = use(params);

  const video = getVideoById(id);
  if (!video) return notFound();

  const [currentEpisode, setCurrentEpisode] = useState(Number(episode));
  const videoUrl = video.videoUrls?.[currentEpisode];
  if (!videoUrl) return notFound();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const episodeCount = video.videoUrls ? Object.keys(video.videoUrls).length : 0;

  // Progress update
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const update = () => {
      setProgress((v.currentTime / v.duration) * 100 || 0);
    };

    v.addEventListener("timeupdate", update);
    return () => v.removeEventListener("timeupdate", update);
  }, [currentEpisode]);

  // Handlers
  const handlePrev = () => {
    if (currentEpisode > 0) setCurrentEpisode((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentEpisode < episodeCount - 1) setCurrentEpisode((prev) => prev + 1);
  };

  const handlePauseToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setMuted(value === 0);
    }
  };

  const toggleMute = () => {
    setMuted((prev) => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
    setShowVolumeSlider(true);
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const toggleLoop = () => {
    setLoop((prev) => {
      if (videoRef.current) videoRef.current.loop = !prev;
      return !prev;
    });
  };

  return (
    <div className="bg-black w-screen h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-full max-w-[1400px]">
        {/* VIDEO AREA */}
        <div className="relative flex-1 flex items-center justify-center bg-black">
          <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-black group">
            <video
              key={currentEpisode}
              ref={videoRef}
              src={videoUrl}
              autoPlay
              playsInline
              loop={loop}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Controls */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onMouseEnter={() => setShowVolumeSlider(false)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              {/* Progress Bar */}
              <input
                type="range"
                value={progress}
                onChange={handleSeek}
                aria-label="Video Progress"
                className="w-full h-[4px] accent-red-500 cursor-pointer"
              />

              {/* Buttons */}
              <div className="flex gap-3 mt-3 text-white justify-between">
                {/* Play / Pause */}
                <div className="flex items-center gap-4">
                <div className="relative group/button">
                  <button
                    onClick={handlePauseToggle}
                    aria-label={isPaused ? "Play Video" : "Pause Video"}
                    className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                  >
                    {isPaused ? (
                      <Play size={18} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Pause size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>

                {/* Next */}
                <div className="relative group/button">
                  <button
                    onClick={handleNext}
                    disabled={currentEpisode === episodeCount - 1}
                    aria-label="Next Episode"
                    className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 disabled:opacity-30 transition"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                </div>

                {/* Mute */}
                <div className="flex items-center gap-4">
                <div
                  className="relative group/button"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onClick={() => setShowVolumeSlider((prev) => !prev)}
                >
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute Video" : "Mute Video"}
                    className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                  >
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  {/* Volume Slider */}
                  {showVolumeSlider && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume Control"
                        aria-hidden={!showVolumeSlider}
                        className="w-20 h-[4px] accent-white cursor-pointer transform rotate-90 origin-center"
                      />
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <div className="relative group/button">
                  <button
                    onClick={toggleFullscreen}
                    aria-label="Toggle Fullscreen"
                    className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                  
        {/* EPISODE LIST / INFO */}
        <div className="hidden lg:flex flex-col w-1/3 border-l border-white/20 p-6 overflow-y-auto">
          <h1 className="text-white font-bold text-3xl mb-2">
            Episode {currentEpisode + 1} - {video.title || "Untitled"}
          </h1>
          <div className="flex items-center gap-4 text-white text-2xl mb-3">
            <span className="flex items-center gap-1">
              <Heart size={16} /> 4.5k
            </span>
            <span className="flex items-center gap-1">
              <Star size={16} /> 77.3k
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={16} /> Share
            </span>
          </div>
          <p className="text-white/80 text-xl mb-4">
            {video.description ||
              "Episode description goes here. Add summary, plot, or teaser text."}
          </p>
          <h3 className="text-white font-semibold mb-2 text-xl">All Episodes</h3>
          <div className="grid grid-cols-6 gap-2">
            {video.videoUrls &&
              Object.keys(video.videoUrls).map((key, idx) => (
                <button
                  key={key}
                  onClick={() => setCurrentEpisode(idx)}
                  aria-label={`Play Episode ${idx + 1}`}
                  className={`px-2 py-2 text-sm rounded-lg transition-colors duration-200 cursor-pointer ${
                    idx === currentEpisode
                      ? "bg-white text-black font-bold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}