"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Play,
  Sparkles,
  BookOpen,
  Clock,
  Compass,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SuttaItem {
  id: string;
  title: string;
  paliTitle: string;
  videoId: string;
  duration: string;
  speaker: string;
  description: string;
  highlights: string[];
}

const FEATURED_SUTTAS: SuttaItem[] = [
  {
    id: "sutta-1",
    title: "මහා සතිපට්ඨාන සූත්‍ර දේශනාව",
    paliTitle: "Maha Sathipattana Suthraya (දීඝ නිකාය)",
    videoId: "RJtkqtpORiA",
    duration: "1:09:59",
    speaker: "සම්බුදු දේශිත පිරිසිදු ධර්ම දේශනාව",
    description:
      "සත්ත්වයන්ගේ විශුද්ධිය පිණිසත්, ශෝක පරිදේවයන් දුරුකිරීම පිණිසත්, දුක් දොම්නස් නැසීම පිණිසත්, න්‍යාය ධර්මයන් ලැබීම පිණිසත්, නිවන් අවබෝධය පිණිසත් පවතින එකම මඟ (ඒකායනෝ අයං භික්ඛවේ මග්ගෝ) වන මහා සතිපට්ඨාන සූත්‍රය.",
    highlights: [
      "කායානුපස්සනාව: ආනාපානසතිය, ඉරියාපථ, චතුරසම්පජඤ්ඤය හා ධාතු මනසිකාරය",
      "වේදනානුපස්සනාව: සැප, දුක්, උපේක්ෂා වේදනාවන්ගේ අනිත්‍ය ස්වභාවය විමසීම",
      "චිත්තානුපස්සනාව: රාග, දෝස, මෝහ සහිත හා රහිත සිත් ඇතිසැටියෙන් දැකීම",
      "ධම්මානුපස්සනාව: පංච නීවරණ, පංචස්කන්ධ, ආයතන, බොජ්ඣංග හා චතුරාර්ය සත්‍යය",
    ],
  },
  {
    id: "sutta-2",
    title: "ධම්මචක්කප්පවත්තන සූත්‍ර දේශනාව",
    paliTitle: "Dhammacakkappavattana Sutta (සංයුත්ත නිකාය)",
    videoId: "UY8xPDlm0_A",
    duration: "48:15",
    speaker: "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description:
      "තථාගතයන් වහන්සේ විසින් ඇසළ පුන් පොහෝ දින බරණැස ඉසිපතන මිගදායේදී පස්වග තවුසන් උදෙසා දේශනා කළ වදාළ ප්‍රථම ධර්ම දේශනාව හා මධ්‍යම ප්‍රතිපදාව.",
    highlights: [
      "අන්ත දෙක: කාමසුඛල්ලිකානුයෝගය සහ අත්ථකිලමථානුයෝගය බැහැර කිරීම",
      "මධ්‍යම ප්‍රතිපදාව: ආර්ය අෂ්ටාංගික මාර්ගය ප්‍රගුණ කිරීම",
      "චතුරාර්ය සත්‍යය: දුක්ඛ, සමුදය, නිරෝධ, මාර්ග සත්‍යයන්ගේ ත්‍රිපරිවට්ටය",
    ],
  },
  {
    id: "sutta-3",
    title: "ගිරිමානන්ද සූත්‍ර දේශනාව හා දස සංඥා",
    paliTitle: "Girimananda Sutta (අංගුත්තර නිකාය)",
    videoId: "nY_3-vBkn6Q",
    duration: "36:40",
    speaker: "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description:
      "ගිලන්ව වැඩසිටි ගිරිමානන්ද මහරහතන් වහන්සේ උදෙසා බුදුරජාණන් වහන්සේ විසින් ආනන්ද හිමියන් අත දේශනා කොට එවූ දස සංඥා භාවනාව.",
    highlights: [
      "අනිච්ච සංඥාව, අනත්ත සංඥාව හා අසුභ සංඥාව",
      "ආදීනව සංඥාව, පහාන සංඥාව හා විරාග සංඥාව",
      "නිරෝධ සංඥාව හා ආනාපානසති මනසිකාරය",
    ],
  },
  {
    id: "sutta-4",
    title: "අනත්තලක්ඛණ සූත්‍ර විවරණය",
    paliTitle: "Anattalakkhana Sutta (සංයුත්ත නිකාය)",
    videoId: "IlVUnoUSb8E",
    duration: "42:10",
    speaker: "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    description:
      "රූප, වේදනා, සඤ්ඤා, සංඛාර, විඤ්ඤාණ යන පංචස්කන්ධය මම නොවේ, මාගේ නොවේ, මගේ ආත්මය නොවේ යයි නුවණින් දැකීමෙන් පස්වග තවුසන් රහත්භාවයට පත් වූ උතුම් දෙසුම.",
    highlights: [
      "පංචස්කන්ධයේ අනත්ත (අනාත්ම) ස්වභාවය විවරණය",
      "ත්‍රිලක්ෂණය: අනිත්‍ය වූ යමක් වේ නම් එය දුක්ඛයි, අනාත්මයි",
      "සසර බැඳීම්වලින් සිත මිදී නිදහස් වන ආර්ය අවබෝධය",
    ],
  },
];

export default function FeaturedSuttaDiscourse() {
  const [activeTab, setActiveTab] = useState(0);
  const currentSutta = FEATURED_SUTTAS[activeTab];

  return (
    <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e6dfd3] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc2a5]/40 text-[#92400e] text-xs font-semibold mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
            <span>මූලික ධර්ම දේශනා හා සූත්‍ර විවරණ</span>
          </div>
          <h2 className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#1e293b]">
            විශේෂ සූත්‍ර දේශනා සහ භාවනා අනුශාසනා එකතුව
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
            සිත දමනය කරගැනීම සහ විදර්ශනා නුවණ වඩාගැනීම සඳහා සම්බුදු සසුනේ උතුම් මූලික සූත්‍ර දේශනාවන් ශ්‍රවණය කරන්න.
          </p>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${currentSutta.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#92400e] hover:underline shrink-0"
        >
          <span>YouTube හි විවෘත කරන්න</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Sutta Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FEATURED_SUTTAS.map((sutta, idx) => (
          <button
            key={sutta.id}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === idx
                ? "bg-[#92400e] text-white shadow-sm"
                : "bg-[#fdfbf7] text-[#334155] hover:bg-[#f1ece1] border border-[#e6dfd3]"
            }`}
          >
            <span>{sutta.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === idx ? "bg-white/20 text-amber-100" : "bg-[#f1ece1] text-[#64748b]"
              }`}
            >
              {sutta.duration}
            </span>
          </button>
        ))}
      </div>

      {/* Active Sutta Interactive Player Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 16:9 Video Container */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-lg border border-[#e6dfd3] bg-black">
          <div className="relative w-full aspect-16-9">
            <iframe
              src={`https://www.youtube.com/embed/${currentSutta.videoId}?rel=0&modestbranding=1`}
              title={currentSutta.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Sutta Highlights and Contemplation Points */}
        <div className="lg:col-span-5 bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#92400e] block">
              {currentSutta.speaker}
            </span>
            <h3 className="font-serif-monastic font-semibold text-base sm:text-lg text-[#1e293b]">
              {currentSutta.title}
            </h3>
            <span className="text-xs text-[#64748b] font-medium block">
              {currentSutta.paliTitle}
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            {currentSutta.description}
          </p>

          <div className="pt-2 border-t border-[#e6dfd3]">
            <span className="text-xs font-semibold text-[#1e293b] block mb-2">
              දේශනාවේ ප්‍රධාන කරුණු හා භාවනා මනසිකාර:
            </span>
            <ul className="space-y-2 text-xs text-[#334155]">
              {currentSutta.highlights.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#ffc2a5]/50 text-[#92400e] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
