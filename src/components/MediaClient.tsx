"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Play,
  CheckCircle2,
  ExternalLink,
  Radio,
  Clock,
  Sparkles,
  Send,
  HelpCircle,
  Share2,
} from "lucide-react";
import YoutubeIcon from "./YoutubeIcon";
import { YouTubeChannelStats, YouTubeVideoItem } from "@/lib/youtube";
import ResponsiveVideoModal from "./ResponsiveVideoModal";
import FeaturedSuttaDiscourse from "./FeaturedSuttaDiscourse";

interface MediaClientProps {
  channel: YouTubeChannelStats;
  videos: YouTubeVideoItem[];
}

export default function MediaClient({ channel, videos }: MediaClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("සියලු දේශනා (All)");

  // Dhamma question form state
  const [questionForm, setQuestionForm] = useState({
    name: "",
    contact: "",
    topic: "",
    question: "",
  });
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const categories = [
    "සියලු දේශනා (All)",
    "සූත්‍ර ධර්ම දේශනා (Sutta)",
    "භාවනා උපදෙස් (Meditation Guides)",
    "පොහෝ දින දෙසුම් (Poya Sermons)",
    "දහම් ගැටළු හා පිළිතුරු (Q&A)",
  ];

  const filteredVideos = useMemo(() => {
    return videos.filter((vid) => {
      const matchesSearch =
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === "සියලු දේශනා (All)") return matchesSearch;
      if (selectedCategory === "සූත්‍ර ධර්ම දේශනා (Sutta)") {
        return matchesSearch && (vid.title.includes("සූත්‍ර") || vid.title.includes("නාමරූප") || vid.title.includes("ආයතන"));
      }
      if (selectedCategory === "භාවනා උපදෙස් (Meditation Guides)") {
        return matchesSearch && (vid.title.includes("භාවනා") || vid.title.includes("සතිය") || vid.title.includes("ආනාපාන"));
      }
      if (selectedCategory === "පොහෝ දින දෙසුම් (Poya Sermons)") {
        return matchesSearch && (vid.title.includes("පෝ") || vid.title.includes("සීල") || vid.title.includes("නෙක්ඛම්ම"));
      }
      return matchesSearch;
    });
  }, [videos, searchQuery, selectedCategory]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* 1. CHANNEL HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111c2d] text-white border border-amber-600/30 shadow-xl">
        {/* Banner background */}
        <div className="h-44 sm:h-64 w-full relative bg-gradient-to-r from-[#14532d] via-[#2e6a41] to-[#111c2d]">
          {channel.bannerUrl && (
            <Image
              src={channel.bannerUrl}
              alt="Channel Banner"
              fill
              className="object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111c2d] via-transparent to-black/30" />
        </div>

        {/* Channel Details Bar */}
        <div className="px-6 sm:px-10 pb-8 -mt-16 sm:-mt-20 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-[#111c2d] shadow-2xl bg-white shrink-0">
              <Image
                src={channel.avatarUrl}
                alt={channel.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-semibold">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span>නිල ධර්ම ප්‍රචාරක අංශය</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-white">
                  {channel.title}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2">
                {channel.description}
              </p>
              <span className="text-xs text-amber-300 font-mono block">
                {channel.customUrl}
              </span>
            </div>
          </div>

          {/* Stats & Subscribe CTA */}
          <div className="flex flex-wrap items-center justify-center gap-6 bg-[#0c1420]/80 border border-slate-700/60 p-4 rounded-2xl">
            <div className="text-center">
              <span className="block font-serif-monastic text-xl font-bold text-amber-400">
                {channel.subscriberCount}
              </span>
              <span className="text-[11px] text-slate-400">දායක සභිකයින්</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="block font-serif-monastic text-xl font-bold text-amber-400">
                {channel.videoCount}
              </span>
              <span className="text-[11px] text-slate-400">දේශනා වීඩියෝ</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <span className="block font-serif-monastic text-xl font-bold text-amber-400">
                {channel.viewCount}
              </span>
              <span className="text-[11px] text-slate-400">නැරඹුම් වාර</span>
            </div>
            <a
              href="https://www.youtube.com/@nirmalabududahama"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>නාලිකාවට එක්වන්න (Subscribe)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. FEATURED SUTTA DISCOURSES & SATIPATTHANA SHOWCASE */}
      <FeaturedSuttaDiscourse />

      {/* 3. VIDEO ARCHIVE & SEARCH / FILTER */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd3] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#92400e] uppercase tracking-wider block">
              ශ්‍රව්‍ය දෘශ්‍ය එකතුව
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              විශේෂ ධර්ම දේශනා සහ සංවාද
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              YouTube Data API v3 මඟින් නිරන්තරයෙන් යාවත්කාලීන වන දේශනා පෙළගැස්ම.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="දේශනා මාතෘකා සොයන්න..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
            />
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#92400e] text-white shadow-sm"
                  : "bg-[#f8f5ee] text-[#334155] hover:bg-[#f1ece1] border border-[#e6dfd3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Videos Grid with 16:9 Responsive aspect ratios */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-[#f8f5ee] rounded-2xl border border-[#e6dfd3]">
            <p className="text-sm text-[#64748b]">ඔබ සෙවූ වචනයට අදාළ දේශනා හමු නොවීය.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("සියලු දේශනා (All)");
              }}
              className="mt-3 text-xs text-[#92400e] font-semibold underline"
            >
              සියලු දේශනා පෙන්වන්න
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() =>
                  setSelectedVideo({
                    id: vid.videoId,
                    title: vid.title,
                  })
                }
                className="bg-[#fdfbf7] hover:bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                {/* 16:9 Video Thumbnail */}
                <div className="relative w-full aspect-16-9 bg-black overflow-hidden">
                  <Image
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#14532d]/90 group-hover:bg-[#92400e] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5 text-amber-200" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    HD
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-monastic font-semibold text-sm text-[#1e293b] line-clamp-2 group-hover:text-[#92400e] transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-[#64748b] mt-1.5 line-clamp-2">
                      {vid.description ||
                        "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ නිර්මල සදහම් දේශනාව."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e6dfd3]/80 flex items-center justify-between text-[11px] text-[#64748b]">
                    <span suppressHydrationWarning>{new Date(vid.publishedAt).toLocaleDateString("si-LK")}</span>
                    <span className="text-[#92400e] font-semibold group-hover:underline flex items-center gap-1">
                      <span>නරඹන්න</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. DHAMMA QUESTIONS & TOPICS SUBMISSION FORM */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>දහම් ගැටළු සහ මාතෘකා</span>
            </div>
            <h2 className="font-serif-monastic text-2xl font-bold text-[#1e293b]">
              ඔබට අවැසි ධර්ම කාරණාවක් හෝ දේශනා මාතෘකාවක් යොමු කරන්න
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b]">
              භාවනා වැඩසටහන්, සූත්‍ර ධර්ම හෝ දෛනික ජීවිතයට අදාළ දහම් ගැටළු ඉදිරි YouTube දේශනා සහ සජීවී සාකච්ඡා මඟින් පිළිතුරු ලබා දීම සඳහා මෙහි සටහන් කරන්න.
            </p>
          </div>

          {questionSubmitted ? (
            <div className="p-8 bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-monastic text-lg font-semibold text-[#1e293b]">
                ඔබගේ දහම් ගැටළුව සාර්ථකව යොමු කෙරිණි!
              </h3>
              <p className="text-xs text-[#64748b] max-w-md mx-auto">
                අතිපූජ්‍ය ස්වාමීන් වහන්සේගේ ඉදිරි දේශනා මාලාවන්හිදී මෙම කරුණු සාකච්ඡාවට ගැනීමට කටයුතු කරනු ඇත. තෙරුවන් සරණයි!
              </p>
              <button
                onClick={() => {
                  setQuestionSubmitted(false);
                  setQuestionForm({ name: "", contact: "", topic: "", question: "" });
                }}
                className="mt-4 px-5 py-2 text-xs font-semibold text-[#92400e] bg-[#ffc2a5]/40 hover:bg-[#ffc2a5]/70 rounded-xl transition-colors"
              >
                තවත් ගැටළුවක් යොමු කරන්න
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    ඔබගේ නම (විකල්ප)
                  </label>
                  <input
                    type="text"
                    value={questionForm.name}
                    onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                    placeholder="නිශ්ශංක..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    දුරකථන අංකය හෝ විද්‍යුත් තැපෑල (විකල්ප)
                  </label>
                  <input
                    type="text"
                    value={questionForm.contact}
                    onChange={(e) => setQuestionForm({ ...questionForm, contact: e.target.value })}
                    placeholder="07X XXX XXXX"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  මාතෘකාව හෝ අදාළ ක්ෂේත්‍රය *
                </label>
                <input
                  type="text"
                  required
                  value={questionForm.topic}
                  onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                  placeholder="උදා: සතිපට්ඨාන භාවනාව, ආනාපානසතිය, නාමරූප විග්‍රහය..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  ඔබගේ දහම් ගැටළුව හෝ විමසීම *
                </label>
                <textarea
                  rows={4}
                  required
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="ගැටළුව පැහැදිලිව මෙහි සටහන් කරන්න..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748b]">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>පෞද්ගලිකත්වය සුරැකේ - නම හෝ තොරතුරු දේශනාවේදී ප්‍රසිද්ධ නොකෙරේ.</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ගැටළුව යොමු කරන්න</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Responsive Video Modal */}
      <ResponsiveVideoModal
        videoId={selectedVideo?.id || null}
        videoTitle={selectedVideo?.title}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
