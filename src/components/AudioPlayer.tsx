"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, Radio } from "lucide-react";

interface Track {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  url: string;
}

const CHANTING_TRACKS: Track[] = [
  {
    id: "1",
    title: "මහා සතිපට්ඨාන සුත්‍රය",
    subtitle: "ආරණ්‍යවාසී මහා සංඝරත්නයේ සෙත් පිරිත් සජ්ඣායනය",
    duration: "14:20",
    url: "https://www.youtube.com/watch?v=RJtkqtpORiA",
  },
  {
    id: "2",
    title: "කරණීයමෙත්ත සූත්‍රය",
    subtitle: "මෙත් සිසිල පතුරුවන උතුම් සූත්‍ර දේශනාව",
    duration: "08:15",
    url: "https://ia800301.us.archive.org/15/items/Pirith_Chanting/03_Karaniya_Metta_Sutta.mp3",
  },
  {
    id: "3",
    title: "මෝර පිරිත් දේශනාව",
    subtitle: "ආරක්ෂක පිරිත් දේශනා මාලාව",
    duration: "06:45",
    url: "https://ia800301.us.archive.org/15/items/Pirith_Chanting/04_Mora_Paritta.mp3",
  },
  {
    id: "4",
    title: "මහා මංගල සූත්‍රය",
    subtitle: "උතුම් මංගල කරුණු 38 ක් ඇතුළත් සූත්‍රය",
    duration: "11:30",
    url: "https://ia800301.us.archive.org/15/items/Pirith_Chanting/01_Maha_Mangala_Sutta.mp3",
  },
];

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = CHANTING_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % CHANTING_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + CHANTING_TRACKS.length) % CHANTING_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl p-6 shadow-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Track info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#92400e]/10 border border-[#92400e]/20 flex items-center justify-center text-[#92400e] shrink-0">
            {isPlaying ? (
              <Radio className="w-7 h-7 text-[#92400e] animate-pulse" />
            ) : (
              <Music2 className="w-7 h-7 text-[#92400e]" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#92400e] block">
              දැන් වාදනය වන්නේ (Now Playing)
            </span>
            <h4 className="font-serif-monastic font-semibold text-base sm:text-lg text-[#1e293b]">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-[#64748b]">{currentTrack.subtitle}</p>
          </div>
        </div>

        {/* Controls & Progress bar */}
        <div className="w-full md:max-w-md flex flex-col items-center gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2 text-[#475569] hover:text-[#92400e] transition-colors rounded-full hover:bg-[#f1ece1]"
              title="පෙර සූත්‍රය"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#92400e] hover:bg-[#712c00] text-white flex items-center justify-center shadow-md hover:shadow transition-all active:scale-95"
              aria-label={isPlaying ? "විරාම කරන්න" : "වාදනය කරන්න"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 text-[#475569] hover:text-[#92400e] transition-colors rounded-full hover:bg-[#f1ece1]"
              title="මීළඟ සූත්‍රය"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 text-[#475569] hover:text-[#92400e] transition-colors rounded-full hover:bg-[#f1ece1]"
              title={isMuted ? "ශබ්දය ක්‍රියාත්මක කරන්න" : "නිශ්ශබ්ද කරන්න"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Slider */}
          <div className="w-full flex items-center gap-2 text-[11px] text-[#64748b]">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#e6dfd3] rounded-lg appearance-none cursor-pointer accent-[#92400e]"
            />
            <span className="w-10">{formatTime(duration) || currentTrack.duration}</span>
          </div>
        </div>
      </div>

      {/* Playlist Selector Pills */}
      <div className="mt-6 pt-4 border-t border-[#e6dfd3] flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#475569] mr-2">සෙත් පිරිත් මාලාව:</span>
        {CHANTING_TRACKS.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentTrackIndex === idx
                ? "bg-[#92400e] text-white shadow-sm"
                : "bg-[#f1ece1] text-[#334155] hover:bg-[#e6dfd3]"
            }`}
          >
            {track.title}
          </button>
        ))}
      </div>
    </div>
  );
}
