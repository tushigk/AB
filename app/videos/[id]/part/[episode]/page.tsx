"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Play,
  Pause,
  Heart,
  Share2,
  Star,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { dramaApi } from "@/apis";

export default function EpisodePage() {
  const { id, episode } = useParams();

  // --- Fetch drama by ID ---
  const { data, isLoading, error } = useSWR(
    id ? `swr.drama.detail.${id}` : null,
    async () => {
      const res = await dramaApi.getDrama({ id: String(id) });
      return res;
    },
    { revalidateOnFocus: false }
  );

  if (isLoading) return <p className="p-6">⏳ Уншиж байна...</p>;
  if (error || !data) return <p className="p-6">❌ Алдаа гарлаа</p>;
  if (!data) return notFound();

  // --- Episodes ---
  const initialEpisode = Number(episode) - 1; // route param is 1-based → convert to 0-based index
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

  const episodeCount = data.videoUrls
    ? Array.isArray(data.videoUrls)
      ? data.videoUrls.length
      : Object.keys(data.videoUrls).length
    : 0;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- Video states ---
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // --- Get video url safely ---
  const videoUrl = Array.isArray(data.videoUrls)
    ? data.videoUrls[currentEpisode]
    : data.videoUrls?.[String(currentEpisode + 1)];

  // --- Progress update ---
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const update = () => {
      setProgress((v.currentTime / v.duration) * 100 || 0);
    };
    v.addEventListener("timeupdate", update);
    return () => v.removeEventListener("timeupdate", update);
  }, [currentEpisode]);

  // --- Handlers ---
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

  // --- UI ---
  return (
    <div className="bg-background w-screen h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-full max-w-[1400px]">
        {/* VIDEO AREA */}
        <div className="relative flex-1 flex items-center justify-center bg-background">
          <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-black group">
            {videoUrl ? (
              <video
                key={currentEpisode}
                ref={videoRef}
                src={videoUrl}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white">
                ⚠️ Энэ ангид видео олдсонгүй
              </div>
            )}

            {/* Controls */}
            {videoUrl && (
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
                  <div className="flex items-center gap-4">
                    {/* Play / Pause */}
                    <button
                      onClick={handlePauseToggle}
                      aria-label={isPaused ? "Play Video" : "Pause Video"}
                      className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                    >
                      {isPaused ? <Play size={18} /> : <Pause size={18} />}
                    </button>

                    {/* Next */}
                    <button
                      onClick={handleNext}
                      disabled={currentEpisode === episodeCount - 1}
                      aria-label="Next Episode"
                      className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 disabled:opacity-30 transition"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Mute */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                    >
                      <button
                        onClick={toggleMute}
                        aria-label={muted ? "Unmute Video" : "Mute Video"}
                        className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
                      >
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>

                      {showVolumeSlider && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-[4px] accent-white cursor-pointer transform rotate-90 origin-center"
                          />
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
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
            )}
          </div>
        </div>

        {/* EPISODE LIST / INFO */}
        <div className="hidden lg:flex flex-col w-1/3 border-l border-gray-800 p-6 overflow-y-auto">
          <h1 className="text-foreground font-bold text-3xl mb-2">
            Episode {currentEpisode + 1} – {data.title}
          </h1>
          <div className="flex items-center gap-4 text-foreground text-2xl mb-3">
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
          <p className="text-foreground/80 text-xl mb-4">{data.description}</p>

          <h3 className="text-foreground font-semibold mb-2 text-xl">
            All Episodes
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {data.videoUrls &&
              (Array.isArray(data.videoUrls)
                ? data.videoUrls.map((_: any, idx: any) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentEpisode(idx)}
                      aria-label={`Play Episode ${idx + 1}`}
                      className={`px-2 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        idx === currentEpisode
                          ? "bg-black/10 text-foreground font-bold"
                          : "bg-gray-800 text-white hover:bg-background/20"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))
                : Object.keys(data.videoUrls).map((key, idx) => (
                    <button
                      key={key}
                      onClick={() => setCurrentEpisode(idx)}
                      aria-label={`Play Episode ${idx + 1}`}
                      className={`px-2 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        idx === currentEpisode
                          ? "bg-black/10 text-foreground font-bold"
                          : "bg-gray-800 text-white hover:bg-background/20"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )))}
          </div>
        </div>
      </div>
    </div>
  );
}
