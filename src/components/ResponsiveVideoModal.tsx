"use client";

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import YoutubeIcon from "./YoutubeIcon";

interface ResponsiveVideoModalProps {
  videoId: string | null;
  videoTitle?: string;
  onClose: () => void;
}

export default function ResponsiveVideoModal({
  videoId,
  videoTitle,
  onClose,
}: ResponsiveVideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (videoId) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111c2d] rounded-2xl shadow-2xl overflow-hidden border border-amber-600/30 flex flex-col">
        {/* Video Header Bar */}
        <div className="px-4 py-3 bg-[#0d1624] flex items-center justify-between border-b border-slate-800 text-white">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <YoutubeIcon className="w-5 h-5 text-red-500 shrink-0" />
            <h4 className="text-xs sm:text-sm font-medium text-amber-100 truncate">
              {videoTitle || "ධර්ම දේශනාව - අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ"}
            </h4>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="YouTube හි නරඹන්න"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="වසන්න"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Responsive Video Container */}
        <div className="relative w-full aspect-16-9 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={videoTitle || "YouTube Video Player"}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Footer Info */}
        <div className="px-4 py-2.5 bg-[#0d1624] text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <span className="text-emerald-400 font-medium text-[11px] sm:text-xs">
            නිර්මල බුදු දහම • කපුගම සුමනවංශ සෙනසුන
          </span>
          <span className="text-slate-400 text-[10px] sm:text-[11px]">
            Esc ඔබා හෝ X ක්ලික් කර වසන්න
          </span>
        </div>
      </div>
    </div>
  );
}
