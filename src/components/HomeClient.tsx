"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Calendar,
  Clock,
  Heart,
  ExternalLink,
  Sparkles,
  Volume2,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Video,
} from "lucide-react";
import { YouTubeChannelStats, YouTubeVideoItem } from "@/lib/youtube";
import ResponsiveVideoModal from "./ResponsiveVideoModal";
import DanaBookingModal from "./DanaBookingModal";

interface HomeClientProps {
  channel: YouTubeChannelStats;
  videos: YouTubeVideoItem[];
}

export default function HomeClient({ channel, videos }: HomeClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [danaModalOpen, setDanaModalOpen] = useState(false);

  // Countdown to next Poya Day
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 28,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredVideo = videos[0] || {
    videoId: "IlVUnoUSb8E",
    title: "ආයතන අපේ ලඟ තියෙන එකක් නෙවෙයි | අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    publishedAt: "2026-09-12T00:00:12Z",
    thumbnailUrl: "/images/temple/01.jpg",
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#f8f5ee] to-[#f1ece1] pt-6 sm:pt-10">
        {/* Ambient forest and golden light effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Monastery Details & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Sacred Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffc2a5]/40 border border-[#92400e]/30 text-[#92400e] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              <span>අරණ්‍ය සේනාසන පුණ්‍ය භූමිය • මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-monastic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e293b] leading-tight tracking-tight">
              ශාන්ත සිතින් <span className="text-[#92400e]">නිර්මල බුදු දහම</span> ප්‍රගුණ කරන ආරණ්‍ය සෙනසුන
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              කපුගම සුමනවංශ නා හිමි සෙනසුන, මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත. චිත්ත සමාධියත්, ධර්මාවබෝධයත් සොයා වඩින සැදැහැවතුන්ට සෙවණ සදන වනගත ආරණ්‍යය.
            </p>

            {/* Chief Monk Citation Card */}
            <div className="bg-[#f8f5ee]/90 border border-[#e6dfd3] p-4 rounded-2xl flex items-center gap-4 max-w-xl mx-auto lg:mx-0 shadow-sm">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d97706] p-0.5 bg-white shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-semibold text-[#92400e] uppercase tracking-wider block">
                  ප්‍රධාන අනුශාසක හිමිපාණන්
                </span>
                <p className="font-serif-monastic font-semibold text-sm sm:text-base text-[#1e293b]">
                  පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ
                </p>
                <p className="text-xs text-[#64748b]">
                  විදර්ශනා හා සතිපට්ඨාන භාවනා ගුරුදේව
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/media"
                className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-current text-amber-200 group-hover:scale-110 transition-transform" />
                <span>ධර්ම දේශනා ශ්‍රවණය කරන්න</span>
              </Link>

              <button
                onClick={() => setDanaModalOpen(true)}
                className="px-6 py-3 rounded-full text-sm font-semibold text-[#14532d] bg-[#b1f2be]/40 hover:bg-[#b1f2be]/70 border border-[#14532d]/30 transition-all duration-200 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current text-[#14532d]" />
                <span>දානමය දායකත්වයන්</span>
              </button>

              <Link
                href="/contact"
                className="px-5 py-3 rounded-full text-sm font-medium text-[#475569] hover:text-[#1e293b] hover:bg-white/80 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>සේනාසනයට පිවිසෙන්න</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative halo */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#92400e]/20 via-[#d97706]/20 to-[#14532d]/20 blur-lg" />

              <div className="relative rounded-3xl overflow-hidden border-2 border-[#e6dfd3] shadow-xl bg-white">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/images/temple/01.jpg"
                    alt="කපුගම සුමනවංශ නා හිමි සෙනසුන පරිශ්‍රය"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Floating caption card */}
                <div className="p-5 bg-[#fdfbf7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#92400e]">
                        ආරණ්‍යක සෙනසුන් පරිසරය
                      </span>
                      <h4 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
                        බෙලිඅත්ත මල්ගහ කොරටුව පුණ්‍ය භූමිය
                      </h4>
                    </div>
                    <Link
                      href="/gallery"
                      className="text-xs font-semibold text-[#14532d] hover:underline flex items-center gap-1"
                    >
                      <span>ගැලරිය</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <p className="mt-2 text-xs text-[#64748b]">
                    චිත්ත ඒකාග්‍රතාවය හා ධර්ම මනසිකාරය උදෙසා වෙන් වූ ස්වභාවික නිහඬ පරිසරය.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. YOUTUBE CHANNEL & RECENT DHAMMA SERMONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>නිල YouTube නාලිකාව හා සදහම් දේශනා</span>
            </div>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ සදහම් දේශනා
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              යූටියුබ් නාලිකාවට එක්වන සියලුම නවතම දේශනා ස්වයංක්‍රීයව මෙහි යාවත්කාලීන වේ.
            </p>
          </div>

          <Link
            href="/media"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#92400e] bg-[#ffc2a5]/30 hover:bg-[#ffc2a5]/50 transition-colors shrink-0"
          >
            <span>සියලු දේශනා බලන්න ({videos.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Channel Banner Card */}
        <div className="bg-gradient-to-r from-[#14532d] to-[#0a3019] rounded-2xl p-6 text-white mb-8 shadow-lg border border-emerald-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-white shadow-md">
                <Image
                  src={channel.avatarUrl}
                  alt={channel.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif-monastic font-semibold text-lg sm:text-xl text-amber-200">
                    {channel.title}
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  නිල ධර්ම ප්‍රචාරක අංශය • {channel.customUrl}
                </p>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center gap-4 sm:gap-6 text-center">
              <div>
                <span className="block font-serif-monastic text-xl font-bold text-amber-300">
                  {channel.subscriberCount}
                </span>
                <span className="text-[11px] text-emerald-200">දායක සභිකයින්</span>
              </div>
              <div className="w-px h-8 bg-emerald-700/60" />
              <div>
                <span className="block font-serif-monastic text-xl font-bold text-amber-300">
                  {channel.videoCount}
                </span>
                <span className="text-[11px] text-emerald-200">දේශනා වීඩියෝ</span>
              </div>
              <div className="w-px h-8 bg-emerald-700/60" />
              <a
                href="https://www.youtube.com/@nirmalabududahama"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow hover:shadow-md flex items-center gap-1.5"
              >
                <span>Subscribe</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Featured Video + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Video Card (16:9 aspect) */}
          <div className="lg:col-span-7 bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl overflow-hidden shadow-md flex flex-col justify-between">
            <div
              onClick={() =>
                setSelectedVideo({
                  id: featuredVideo.videoId,
                  title: featuredVideo.title,
                })
              }
              className="relative w-full aspect-16-9 group cursor-pointer overflow-hidden bg-black"
            >
              <Image
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#92400e]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform pulse-gold">
                  <Play className="w-7 h-7 fill-current ml-1 text-amber-200" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-mono">
                16 : 9 Full HD
              </span>
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-[#92400e]">නවතම සදහම් දේශනාව</span>
              <h3 className="font-serif-monastic font-semibold text-lg text-[#1e293b] mt-1 line-clamp-2">
                {featuredVideo.title}
              </h3>
              <p className="text-xs text-[#64748b] mt-2 line-clamp-2">
                {featuredVideo.description ||
                  "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ විසින් දේශනා කරන ලද නිර්මල සූත්‍ර දේශනාව."}
              </p>
              <div className="mt-4 pt-3 border-t border-[#e6dfd3] flex items-center justify-between text-xs text-[#475569]">
                <span suppressHydrationWarning>{new Date(featuredVideo.publishedAt).toLocaleDateString("si-LK")}</span>
                <button
                  onClick={() =>
                    setSelectedVideo({
                      id: featuredVideo.videoId,
                      title: featuredVideo.title,
                    })
                  }
                  className="text-[#92400e] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>දැන් නරඹන්න</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: List of 3-4 Recent Sermons */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {videos.slice(1, 5).map((vid) => (
              <div
                key={vid.id}
                onClick={() =>
                  setSelectedVideo({
                    id: vid.videoId,
                    title: vid.title,
                  })
                }
                className="bg-[#fdfbf7] hover:bg-[#f8f5ee] border border-[#e6dfd3] rounded-xl p-3 flex gap-3.5 items-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow group"
              >
                <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <Image
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-amber-300" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-serif-monastic text-xs sm:text-sm font-semibold text-[#1e293b] line-clamp-2 group-hover:text-[#92400e] transition-colors">
                    {vid.title}
                  </h4>
                  <p suppressHydrationWarning className="text-[11px] text-[#64748b] mt-1">
                    {new Date(vid.publishedAt).toLocaleDateString("si-LK")}
                  </p>
                </div>
              </div>
            ))}

            <Link
              href="/media"
              className="p-3.5 rounded-xl border border-dashed border-[#92400e]/40 text-center text-xs font-semibold text-[#92400e] hover:bg-[#ffc2a5]/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>සියලුම දේශනා එකතුව විවෘත කරන්න</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING POYA DAY PROGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle golden moon decoration */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Program info & Countdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>ළඟම එන පොහෝ දින සීල වැඩසටහන</span>
              </div>

              <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
                මැදින් පුර පසළොස්වක පොහෝ දින ශීල සමාදාන මහා පිංකම
              </h2>

              <p className="text-sm text-[#475569] leading-relaxed">
                පෝදා උදෑසන 6.00 සිට සවස 5.30 දක්වා කපුගම සුමනවංශ නා හිමි ආරණ්‍ය සේනාසන භූමියේදී පැවැත්වෙන පින්බර සිල් සමාදානය. සතිපට්ඨාන භාවනාව සහ ධර්ම සාකච්ඡා ඇතුළත් සම්පූර්ණ වැඩසටහන් මාලාව.
              </p>

              {/* Countdown timer */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#64748b] block mb-2">
                  පිංකම ආරම්භ වීමට තවත්:
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md">
                  <div className="bg-[#fdfbf7] border border-[#e6dfd3] p-3 rounded-xl text-center shadow-sm">
                    <span className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#92400e] block">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#64748b]">දින (Days)</span>
                  </div>
                  <div className="bg-[#fdfbf7] border border-[#e6dfd3] p-3 rounded-xl text-center shadow-sm">
                    <span className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#92400e] block">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#64748b]">පැය (Hours)</span>
                  </div>
                  <div className="bg-[#fdfbf7] border border-[#e6dfd3] p-3 rounded-xl text-center shadow-sm">
                    <span className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#92400e] block">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#64748b]">මිනිත්තු (Mins)</span>
                  </div>
                  <div className="bg-[#fdfbf7] border border-[#e6dfd3] p-3 rounded-xl text-center shadow-sm">
                    <span className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#92400e] block">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#64748b]">තත්පර (Secs)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setDanaModalOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current text-amber-200" />
                  <span>සීල දානය සඳහා දායක වන්න</span>
                </button>
                <Link
                  href="/calendar"
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#14532d] bg-white hover:bg-[#f1ece1] border border-[#e6dfd3] transition-colors"
                >
                  සම්පූර්ණ කාලසටහන බලන්න
                </Link>
              </div>
            </div>

            {/* Right: Quick Timetable snapshot */}
            <div className="lg:col-span-5 bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-serif-monastic font-semibold text-sm text-[#1e293b] border-b border-[#e6dfd3] pb-2 flex items-center justify-between">
                <span>පෝදා දෛනික වැඩසටහන</span>
                <Clock className="w-4 h-4 text-[#92400e]" />
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f5ee]">
                  <span className="font-semibold text-[#92400e]">පෙ.ව. 06:00</span>
                  <span className="text-[#334155]">උපෝසථ අෂ්ටාංග ශීලය සමාදන් කරවීම</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f5ee]">
                  <span className="font-semibold text-[#92400e]">පෙ.ව. 08:00</span>
                  <span className="text-[#334155]">සතිපට්ඨාන භාවනාව හා ධර්මානුශාසනාව</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f5ee]">
                  <span className="font-semibold text-[#92400e]">පෙ.ව. 11:30</span>
                  <span className="text-[#334155]">දහවල් සම්බුද්ධ පූජාව සහ සංඝගත දානය</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f5ee]">
                  <span className="font-semibold text-[#92400e]">ප.ව. 01:00</span>
                  <span className="text-[#334155]">දහම් දෙසුම සහ ධර්ම සාකච්ඡාව</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f5ee]">
                  <span className="font-semibold text-[#92400e]">ප.ව. 05:00</span>
                  <span className="text-[#334155]">බුද්ධ වන්දනාව හා සිල් පවාරණය</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MONASTERY HERMITAGE GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
              සේනාසන ජීවිතය හා පින්බිම
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              ආරණ්‍යක සංඝ රත්නය සහ ශාන්ත ආශ්‍රම පරිසරය
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              වනගත භාවනා කුටි, ත්‍රිවිධ චෛත්‍යය වන්දනාව සහ ශාසනික වත්පිළිවෙත් තුළින් සිත පහන් කරවන දසුන් පෙළක්.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#14532d] hover:underline shrink-0"
          >
            <span>සියලු පිංකම් ඡායාරූප (ගැලරිය)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Masonry image grid using provided temple images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group border border-[#e6dfd3]">
            <Image
              src="/images/temple/01.jpg"
              alt="සේනාසන පරිසරය"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] text-amber-300 uppercase font-semibold">සේනාසන පරිසරය</span>
              <p className="font-serif-monastic text-sm font-semibold leading-tight">
                භාවනා කුටි සහ සක්මන් මංපෙත්
              </p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group border border-[#e6dfd3]">
            <Image
              src="/images/temple/IMG_1509.jpg"
              alt="චෛත්‍ය රාජයාණන් වහන්සේ"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] text-amber-300 uppercase font-semibold">පිංකම්</span>
              <p className="font-serif-monastic text-sm font-semibold leading-tight">
                උතුම් සෑරදුන් සහ මහා සංඝරත්නය
              </p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group border border-[#e6dfd3]">
            <Image
              src="/images/temple/IMG_2745.JPG"
              alt="පෝදා සීල සමාදානය"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] text-amber-300 uppercase font-semibold">පොහෝ දින</span>
              <p className="font-serif-monastic text-sm font-semibold leading-tight">
                උපාසක උපාසිකාවන්ගේ සිල් සමාදානය
              </p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group border border-[#e6dfd3]">
            <Image
              src="/images/temple/209.jpg"
              alt="වනගත භාවනා කුටිය"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] text-amber-300 uppercase font-semibold">ආරණ්‍ය ජීවිතය</span>
              <p className="font-serif-monastic text-sm font-semibold leading-tight">
                වනගත විවේකය හා චිත්ත සමාධිය
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISITOR GUIDELINES & MONASTERY DECORUM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>බැතිමතුන් වෙත විශේෂ නිවේදනය</span>
            </div>
            <h2 className="font-serif-monastic text-2xl font-bold text-[#1e293b]">
              ආරණ්‍ය සේනාසන පිළිවෙත් සහ ආචාරධර්ම
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              ආරණ්‍ය සේනාසනයේ පවතින උතුම් චිත්ත සමාධිය සහ සංඝරත්නයේ භාවනා කටයුතුවලට බාධා නොවන පරිදි පැමිණෙන සැදැහැවතුන් මෙම උපදෙස් අනුගමනය කරත්වා.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-xl space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#92400e]/15 text-[#92400e] inline-flex items-center justify-center font-bold text-xs">
                01
              </span>
              <h4 className="font-serif-monastic font-semibold text-sm text-[#1e293b]">
                පූර්ණ නිහඬතාව
              </h4>
              <p className="text-xs text-[#64748b]">
                සේනාසන භූමිය තුළ ජංගම දුරකථන නිහඬ කර සංයමයෙන් හා නිහඬව කටයුතු කරන්න.
              </p>
            </div>

            <div className="bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-xl space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#92400e]/15 text-[#92400e] inline-flex items-center justify-center font-bold text-xs">
                02
              </span>
              <h4 className="font-serif-monastic font-semibold text-sm text-[#1e293b]">
                සුදුසු ඇඳුම
              </h4>
              <p className="text-xs text-[#64748b]">
                ශාසනික ගෞරවය ආරක්ෂා වන පරිදි සුදු හෝ චාම් සංවර ඇඳුමකින් සැරසී පැමිණෙන්න.
              </p>
            </div>

            <div className="bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-xl space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#92400e]/15 text-[#92400e] inline-flex items-center justify-center font-bold text-xs">
                03
              </span>
              <h4 className="font-serif-monastic font-semibold text-sm text-[#1e293b]">
                ඡායාරූප සීමා කිරීම
              </h4>
              <p className="text-xs text-[#64748b]">
                භාවනානුයෝගී හිමිවරුන්ගේ විවේකයට බාධා නොවන පරිදි අවසරයකින් තොරව ඡායාරූප ගැනීමෙන් වළකින්න.
              </p>
            </div>

            <div className="bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-xl space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#92400e]/15 text-[#92400e] inline-flex items-center justify-center font-bold text-xs">
                04
              </span>
              <h4 className="font-serif-monastic font-semibold text-sm text-[#1e293b]">
                නියමිත වේලාවන්
              </h4>
              <p className="text-xs text-[#64748b]">
                දානමය හා බැහැදැකීමේ නියමිත වේලාවන් තුළ පමණක් සේනාසනයට පිවිසෙන්න.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <ResponsiveVideoModal
        videoId={selectedVideo?.id || null}
        videoTitle={selectedVideo?.title}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Dana Booking Modal */}
      <DanaBookingModal
        isOpen={danaModalOpen}
        onClose={() => setDanaModalOpen(false)}
      />
    </div>
  );
}
