"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Flower2,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import DanaBookingModal from "@/components/DanaBookingModal";

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

const MEHENI_DAILY_SCHEDULE: ScheduleItem[] = [
  {
    time: "පෙ.ව. 04:30 - 05:30",
    title: "අලුයම බුද්ධ වන්දනාව හා මෛත්‍රී භාවනාව",
    desc: "දවස ආරම්භ කරමින් ත්‍රිවිධ රත්නය වැඳ නමස්කාර කිරීම සහ සියලු සත්ත්වයන්ට මෙත් සිත පැතිරවීම.",
    icon: Moon,
  },
  {
    time: "පෙ.ව. 06:15 - 07:15",
    title: "හීල් දාන සම්බුද්ධ පූජාව සහ සංඝගත දානය",
    desc: "උදෑසන බුද්ධ පූජාව තැන්පත් කිරීම, ගිලන්පස පූජාව සහ මෙහෙණින් වහන්සේලා විෂයෙහි හීල් දානය පිරිනැමීම.",
    icon: Sun,
  },
  {
    time: "පෙ.ව. 08:00 - 10:00",
    title: "සතිපට්ඨාන භාවනා අභ්‍යාසය හා ධර්මානුශාසනාව",
    desc: "කායානුපස්සනාව හා ආනාපානසති භාවනාව තුළින් චිත්ත සමාධිය වඩාගැනීමේ ප්‍රායෝගික අභ්‍යාසය.",
    icon: Sparkles,
  },
  {
    time: "පෙ.ව. 10:00 - 11:00",
    title: "ආරාමික වතාවත් සහ පෞද්ගලික ධර්ම මෙනෙහි කිරීම",
    desc: "ආරාම මළුව පිරිසිදු කිරීම, බෝධි ඇමදීම සහ තනිව ධර්මය මෙනෙහි කිරීමේ විවේකය.",
    icon: Flower2,
  },
  {
    time: "පෙ.ව. 11:15 - 12:30",
    title: "දහවල් සම්බුද්ධ පූජාව සහ දහවල් දානමය පින්කම",
    desc: "දහවල් බුද්ධ පූජාව, අටපිරිකර පූජාව සහ පැමිණි දායක පින්වතුන්ගේ සහභාගීත්වයෙන් දහවල් දානය පිරිනැමීම.",
    icon: Heart,
  },
  {
    time: "ප.ව. 02:00 - 03:30",
    title: "සූත්‍ර ධර්ම දේශනා සහ දහම් ගැටළු සාකච්ඡාව",
    desc: "මජ්ඣිම නිකාය, සංයුත්ත නිකාය ඇසුරෙන් ගැඹුරු ධර්ම කරුණු විමසීම හා සැදැහැවතියන්ගේ දහම් ගැටළු නිරාකරණය.",
    icon: BookOpen,
  },
  {
    time: "ප.ව. 04:00 - 05:00",
    title: "සක්මන් භාවනාව (Walking Meditation)",
    desc: "ආරාම පරිශ්‍රයේ සක්මන් මළුවල සතිය පිහිටුවාගෙන සක්මන් භාවනාවේ යෙදීම.",
    icon: Compass,
  },
  {
    time: "ප.ව. 05:30 - 06:45",
    title: "සන්ධ්‍යා බුද්ධ වන්දනාව, ගිලන්පස පූජාව සහ බෝධි පූජාව",
    desc: "සන්ධ්‍යා මල්, පහන්, සුවඳ දුම් පූජා කරමින් ආශිර්වාදාත්මක සෙත් පිරිත් සජ්ඣායනය.",
    icon: Moon,
  },
  {
    time: "ප.ව. 07:00 - 08:30",
    title: "නිහඬ සමාධි භාවනාව හා පුණ්‍යානුමෝදනාව",
    desc: "දවස අවසානයේ නිහඬ චිත්ත ඒකාග්‍රතාවය හා දිවා කාලයේ කළ සියලු පින් සකල ලෝකවාසීන්ට අනුමෝදන් කිරීම.",
    icon: Sparkles,
  },
];

const DANA_OPPORTUNITIES = [
  {
    title: "හීල් දාන පූජාව",
    desc: "උදෑසන බුද්ධ පූජාව, කැඳ සහ හීල් දානය මෙහෙණින් වහන්සේලා විෂයෙහි පූජා කිරීම.",
    time: "උදෑසන 6:15",
    tag: "දෛනික දානය",
  },
  {
    title: "දහවල් දානමය පින්කම",
    desc: "දහවල් සම්බුද්ධ පූජාව, ව්‍යංජන සහිත මහා දානය සහ අටපිරිකර ආදී සිවුපස පූජාවන්.",
    time: "පෙ.ව. 11:15",
    tag: "ප්‍රධාන දානය",
  },
  {
    title: "සන්ධ්‍යා ගිලන්පස පූජාව",
    desc: "සවස බුද්ධ වන්දනාව සහ රාත්‍රී කාලයේ මෙහෙණින් වහන්සේලා සඳහා ඖෂධීය ගිලන්පස පූජාව.",
    time: "ප.ව. 5:30",
    tag: "ගිලන්පස",
  },
  {
    title: "පෝදා ශීල දානමය දායකත්වය",
    desc: "පුර පසළොස්වක පොහෝ දිනවල උපෝසථ අෂ්ටාංග ශීලය සමාදන් වන සැදැහැවතියන්ගේ දාන දායකත්වය.",
    time: "පෝය දිනය පුරා",
    tag: "පෝදා පින්කම්",
  },
  {
    title: "චීවර හා බෙහෙත් පූජාව (සිවුපසය)",
    desc: "වැසි සළු, සිවුරු පිරිකර, බෙහෙත් ද්‍රව්‍ය සහ අනෙකුත් පැවිදි උපකරණ පූජා කිරීමේ උතුම් අවස්ථාව.",
    time: "ඕනෑම දිනක",
    tag: "සිවුපසය",
  },
  {
    title: "ආරාම සංවර්ධන හා නඩත්තු පින්කම",
    desc: "මෙහෙණි ආරාමයේ කුටි, සක්මන් මළු, ආලෝක පද්ධති හා ජල පහසුකම් සංවර්ධනය සඳහා දායකත්වය.",
    time: "නිරන්තර පින්කම්",
    tag: "සංවර්ධන",
  },
];

const GUIDELINES = [
  "සුදු හෝ ශාන්ත පැහැති සුදුසු සංවර වස්ත්‍රවලින් සැරසී ආරාම පරිශ්‍රයට පැමිණෙන්න.",
  "මෙහෙණි ආරාමය භාවනානුයෝගී ශාන්ත පුණ්‍ය භූමියක් බැවින් නිහඬතාවය සහ සංවරශීලී බව උපරිමයෙන් සුරකින්න.",
  "දානමය පින්කම් සඳහා කලින් දිනයක් සහ වේලාවක් වෙන්කරවා ගෙන පැමිණීම වඩාත් පහසු වේ (070 117 4907).",
  "ප්ලාස්ටික් හා පොලිතින් පරිහරණය අවම කර පරිසර හිතකාමී ලෙස පූජා ද්‍රව්‍ය රැගෙන ඒමට කාරුණික වන්න.",
  "පොහෝ දින ශීල සමාදානය සඳහා පැමිණෙන උපාසිකාවන් උදෑසන 6.00 ට පෙර පැමිණීම යෝග්‍ය වේ.",
];

export default function MeheniAramayaPage() {
  const [danaModalOpen, setDanaModalOpen] = useState(false);
  const [prefilledDana, setPrefilledDana] = useState("කපුගම සීලවංශ මෙහෙණි ආරාමය - දහවල් දානය");

  const handleOpenDana = (title: string) => {
    setPrefilledDana(`කපුගම සීලවංශ මෙහෙණි ආරාමය - ${title}`);
    setDanaModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#14532d] via-[#1a4329] to-[#0a2313] text-white shadow-2xl border border-amber-500/30">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6 text-center sm:text-left">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
              <Flower2 className="w-3.5 h-3.5 text-amber-300" />
              <span>ආරණ්‍යක කාන්තා සසුන් සෙවණ • බෙලිඅත්ත</span>
            </div>

            <h1 className="font-serif-monastic text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              කපුගම සීලවංශ <span className="text-amber-300">මෙහෙණි ආරාමය</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
              කපුගම සුමනවංශ නා හිමි සෙනසුනට අනුබද්ධව, පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ උතුම් අවවාද අනුශාසනා යටතේ මෙහෙණින් වහන්සේලා සහ දසසිල් මාතාවන් උදෙසා ආරණ්‍යගත නිස්කලංක පරිසරයක ශීල, සමාධි, ප්‍රඥා ගුණධර්ම ප්‍රගුණ කෙරෙන පින්බර ආරණ්‍ය සෙවණ.
            </p>

            {/* Address bar */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-xs sm:text-sm text-amber-100">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත (සේනාසන පරිශ්‍රය)</span>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3.5">
              <button
                type="button"
                onClick={() => handleOpenDana("දානමය දායකත්වය")}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[#111c2d] bg-amber-400 hover:bg-amber-300 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-[#111c2d]" />
                <span>මෙහෙණි ආරාමයට දානය වෙන්කරන්න</span>
              </button>

              <a
                href="tel:0701174907"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>විස්තර විමසීම්: 070 117 4907</span>
              </a>
            </div>
          </div>

          {/* Right Highlight Badge Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-[#fdfbf7] text-[#1e293b] rounded-3xl p-6 shadow-2xl border-2 border-amber-400/60 max-w-sm w-full space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-[#92400e] flex items-center justify-center mx-auto shadow-sm">
                <Flower2 className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold text-[#92400e] uppercase tracking-wider block">
                  ආරණ්‍යක ශාඛාව
                </span>
                <h3 className="font-serif-monastic font-bold text-lg text-[#1e293b]">
                  කපුගම සීලවංශ මෙහෙණි ආරාමය
                </h3>
                <p className="text-xs text-[#64748b]">
                  පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ ප්‍රධාන අනුශාසනා යටතේ පාලනය වේ.
                </p>
              </div>

              <div className="border-t border-[#e6dfd3] pt-3 space-y-2 text-xs text-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#64748b]">වාසය:</span>
                  <span className="font-semibold text-[#14532d]">මෙහෙණින් වහන්සේලා & දසසිල් මාතාවන්</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#64748b]">භාවනා ක්‍රමය:</span>
                  <span className="font-semibold text-[#92400e]">සතිපට්ඨාන විදර්ශනා</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#64748b]">ප්‍රවේශය:</span>
                  <span className="font-semibold text-emerald-800">සැදැහැවතුන්ට විවෘතයි</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="w-full block text-center py-2.5 px-4 rounded-xl bg-[#92400e] hover:bg-[#712c00] text-white text-xs font-semibold transition-colors"
                >
                  මාර්ග විස්තර හා ස්ථානය බලන්න
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PILLARS & PURPOSE */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
            ශාසනික අරමුණු සහ දැක්ම
          </span>
          <h2 className="font-serif-monastic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e293b]">
            කාන්තා සසුන රැකදෙන වනගත ආරාම සෙවණ
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            සම්බුදු සසුනෙහි භික්ෂුණී ශාසනයෙහි ආදර්ශය පෙරදැරි කරගනිමින්, ශාන්ත වනගත නිහඬ පරිසරයක පැවිදි ජීවිතය අර්ථවත් කරගන්නා මෙහෙණින් වහන්සේලා උදෙසා ආරක්ෂිත සහ සුදුසු භාවනා පරිසරයක් සම්පාදනය කිරීම මෙහි ප්‍රධාන අරමුණයි.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#92400e]/10 border border-[#92400e]/20 text-[#92400e] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
              විදර්ශනා හා සතිපට්ඨාන භාවනා
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              කායානුපස්සනා, වේදනානුපස්සනා, චිත්තානුපස්සනා, ධම්මානුපස්සනා යන සතර සතිපට්ඨානය තුළින් සිත දමනය කිරීමේ ප්‍රායෝගික අභ්‍යාසය.
            </p>
          </div>

          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#14532d]/10 border border-[#14532d]/20 text-[#14532d] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
              ශීල විශුද්ධිය හා විනය ගරුක බව
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              පැවිදි දිවියේ පාරිශුද්ධත්වය රැකගනිමින්, උතුම් සීල ගුණය සහ ප්‍රතිපත්තිගරුක පැවිදි චර්යාවන් අකුරටම සුරැකීම.
            </p>
          </div>

          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#92400e] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
              ත්‍රිපිටක ධර්ම අධ්‍යයනය
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              සූත්‍ර පිටකය සහ අභිධර්මය ගැඹුරින් හදාරමින් ධර්ම ඥානය වර්ධනය කරගැනීම සහ දහම් ගැටළු නිරාකරණය.
            </p>
          </div>

          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
              උපාසිකා ශීල භාවනා මෙහෙවර
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              සෑම පෝයකම සහ විශේෂ දිනයන්හිදී ප්‍රදේශවාසී හා දුර බැහැරින් පැමිණෙන සැදැහැති උපාසිකාවන්ට අටසිල් හා දසසිල් සමාදන් කරවීම.
            </p>
          </div>
        </div>
      </section>

      {/* 3. DAILY SCHEDULE OF MEHENI ARAMAYA */}
      <section className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd3] pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
              දෛනික චරියාව
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              කපුගම සීලවංශ මෙහෙණි ආරාමයේ දෛනික කාලසටහන
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              අලුයම 4:30 සිට රාත්‍රී 8:30 දක්වා ක්‍රියාත්මක වන භාවනා, වන්දනා හා වතාවත් පෙළගැස්ම.
            </p>
          </div>

          <span className="text-xs font-semibold text-[#14532d] bg-white px-3.5 py-1.5 rounded-xl border border-[#e6dfd3] shrink-0 self-start md:self-auto">
            දෛනික ප්‍රතිපත්ති පූජා
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEHENI_DAILY_SCHEDULE.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-4 sm:p-5 flex gap-4 items-start shadow-xs hover:shadow transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#92400e]/10 border border-[#92400e]/20 text-[#92400e] flex items-center justify-center shrink-0 group-hover:bg-[#92400e] group-hover:text-white transition-colors">
                <item.icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#92400e] font-mono">
                    {item.time}
                  </span>
                  <span className="text-[10px] text-[#64748b]">පියවර 0{idx + 1}</span>
                </div>
                <h4 className="font-serif-monastic font-semibold text-sm sm:text-base text-[#1e293b] mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DANA & MERIT OPPORTUNITIES & ORDINATION */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd3] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
              පුණ්‍ය මහෝත්සව & ශාසනික මඟ
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              මෙහෙණි ආරාමයට දානමය දායකත්වයන්
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl">
              මෙහෙණින් වහන්සේලා විෂයෙහි හීල් දාන, දහවල් දාන, ගිලන්පස හා සිවුපස පූජාවන් වෙන්කරවා ගැනීමේ අවස්ථාව මෙන්ම උතුම් සසුන්ගත වීමට (පැවිදි වීමට) අපේක්ෂිත පින්වතියන්ට ද මෙහෙණි ආරාමය වෙත පැමිණිය හැක.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenDana("සාමාන්‍ය දානමය දායකත්වය")}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current text-amber-200" />
            <span>දායකත්වයක් වෙන්කරන්න</span>
          </button>
        </div>

        {/* Pevidi Vima / Ordination Announcement Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#712c00] via-[#92400e] to-[#14532d] p-6 sm:p-8 text-white shadow-lg border border-amber-400/40">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300/20 border border-amber-300/30 text-amber-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>උතුම් සසුන්ගත වීම • මෙහෙණි ආරාමයට පැවිදි වීමට පැමිණීමේ අවස්ථාව</span>
              </div>
              <h3 className="font-serif-monastic text-xl sm:text-2xl font-bold text-amber-100">
                මෙහෙණි ආරාමයේදී උතුම් පැවිදි දිවියට ඇතුළත් විය හැකිය
              </h3>
              <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed">
                සසර දුකින් මිදී නිර්වාණ සුවය අරමුණු කොට, සීල, සමාධි, ප්‍රඥා ගුණ වඩමින් ආර්ය මාර්ගයේ ගමන් කිරීමට හා දසසිල් සමාදන්ව ආරණ්‍යක දිවිපෙවෙතක් ගතකරමින් උතුම් පැවිදි දිවියට ඇතුළත් වීමට (සසුන්ගත වීමට) කැමති සැදැහැවත් පින්වත් කුලකාන්තාවන්ට හා මෑණිවරුන්ට කපුගම සීලවංශ මෙහෙණි ආරාමය වෙත පැමිණිය හැකිය.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> දසසිල් මාතා පැවිදි බව
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ආරණ්‍යක සතිපට්ඨාන භාවනා පුහුණුව
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ත්‍රිපිටක ධර්ම ශික්ෂණය හා විනය
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href="tel:0701174907"
                className="px-5 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-[#712c00] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>පැවිදි වීම විමසන්න (070 117 4907)</span>
              </a>
              <a
                href="https://wa.me/94701174907?text=තෙරුවන්%20සරණයි.%20කපුගම%20සීලවංශ%20මෙහෙණි%20ආරාමයේ%20පැවිදි%20වීම%20පිළිබඳව%20තොරතුරු%20දැනගැනීමට%20කැමැත්තෙමි."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp මඟින් විමසන්න</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DANA_OPPORTUNITIES.map((opp, idx) => (
            <div
              key={idx}
              className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#92400e] bg-[#ffc2a5]/30 px-2.5 py-0.5 rounded-md">
                    {opp.tag}
                  </span>
                  <span className="text-xs font-mono text-[#64748b]">{opp.time}</span>
                </div>

                <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b] mt-2">
                  {opp.title}
                </h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  {opp.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#e6dfd3] flex items-center justify-between">
                <span className="text-xs text-[#14532d] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>දායකත්වය විවෘතයි</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenDana(opp.title)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#14532d] hover:bg-[#0a3019] text-white transition-colors cursor-pointer"
                >
                  වෙන්කරන්න
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VISITING GUIDELINES & MONASTIC ETIQUETTE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-[#fdfbf7] border border-[#e6dfd3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#92400e]" />
            <h3 className="font-serif-monastic font-bold text-lg sm:text-xl text-[#1e293b]">
              ආරාමයට පැමිණෙන සැදැහැවතුන් සඳහා උපදෙස්
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b]">
            ආරණ්‍යක පරිසරයක ගෞරවය හා නිහඬතාවය රැකගැනීම උදෙසා කරුණාවෙන් පහත උපදෙස් පිළිපදින්න.
          </p>

          <ul className="space-y-3 pt-2">
            {GUIDELINES.map((guide, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#334155] leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  ✓
                </div>
                <span>{guide}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Map Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#14532d] to-[#0a2313] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              සබඳතා සහ පිහිටීම
            </span>
            <h3 className="font-serif-monastic text-xl font-bold text-amber-100">
              කපුගම සීලවංශ මෙහෙණි ආරාමය
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              කපුගම සුමනවංශ නා හිමි සෙනසුන් භූමිය තුළම පිහිටා ඇත. බෙලිඅත්ත නගරයේ සිට තංගල්ල / හක්මන මාර්ගයෙන් පහසුවෙන් ළඟාවිය හැක.
            </p>
          </div>

          <div className="space-y-3 border-t border-emerald-800/80 pt-4 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>කපුගම සීලවංශ මෙහෙණි ආරාමය, මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <a href="tel:0701174907" className="hover:underline font-bold">070 117 4907 (සෘජු ඇමතුම්)</a>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/contact"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#111c2d] text-xs font-bold transition-all shadow-md"
            >
              සම්පූර්ණ සේනාසන සබඳතා පිටුවට →
            </Link>
          </div>
        </div>
      </section>

      {/* Dana Modal */}
      <DanaBookingModal
        isOpen={danaModalOpen}
        onClose={() => setDanaModalOpen(false)}
        prefilledType={prefilledDana}
      />
    </div>
  );
}
