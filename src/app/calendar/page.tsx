"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Moon,
  Sun,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Edit3,
} from "lucide-react";
import DanaBookingModal from "@/components/DanaBookingModal";
import PoyaScheduleEditorModal from "@/components/PoyaScheduleEditorModal";
import InteractiveBuddhistCalendar from "@/components/InteractiveBuddhistCalendar";
import { MonthlyPoyaSchedule, DEFAULT_POYA_SCHEDULE } from "@/data/poyaSchedule";

interface PoyaEvent {
  id: string;
  name: string;
  date: string;
  poyaName: string;
  status: "reserved" | "available";
  sponsor?: string;
  description: string;
}

const POYA_CALENDAR: PoyaEvent[] = [
  {
    id: "p-1",
    name: "මැදින් පුර පසළොස්වක පෝය",
    date: "2026 මාර්තු 23",
    poyaName: "Medin Full Moon Poya",
    status: "reserved",
    sponsor: "කපුගම කුලරත්න පවුල සහ දායක සභාව",
    description: "බුදුරජාණන් වහන්සේ කිඹුල්වත්පුරයට වැඩමවීම සිහිකෙරෙන උතුම් මැදින් පුන් පොහෝ දිනය.",
  },
  {
    id: "p-2",
    name: "බක් පුර පසළොස්වක පෝය",
    date: "2026 අප්‍රේල් 21",
    poyaName: "Bak Full Moon Poya",
    status: "available",
    description: "සම්බුදුරදුන්ගේ දෙවන ලංකාගමනය සිහිකෙරෙන බක් පෝදා සීල භාවනා පිංකම.",
  },
  {
    id: "p-3",
    name: "වෙසක් පුර පසළොස්වක පෝය",
    date: "2026 මැයි 20",
    poyaName: "Vesak Full Moon Poya",
    status: "reserved",
    sponsor: "සිටිනමලුව ගම්වාසී සියලු සැදැහැවතුන්",
    description: "තෙමඟුල සිහිපත් කෙරෙන උතුම් සම්බුද්ධ තෙමඟුල් මහා පින්කම හා ආලෝක පූජාව.",
  },
  {
    id: "p-4",
    name: "පොසොන් පුර පසළොස්වක පෝය",
    date: "2026 ජූනි 19",
    poyaName: "Poson Full Moon Poya",
    status: "available",
    description: "මිහිඳු මහ රහතන් වහන්සේගේ ලංකාගමනය සිහිකරන උතුම් ධර්ම දූත පෝය.",
  },
  {
    id: "p-5",
    name: "ඇසළ පුර පසළොස්වක පෝය",
    date: "2026 ජූලි 18",
    poyaName: "Esala Full Moon Poya",
    status: "reserved",
    sponsor: "විදේශගත සැදැහැති දායක එකමුතුව",
    description: "ධම්මචක්කප්පවත්තන සූත්‍ර දේශනාව හා වස්සාන සමය ඇරඹෙන පින්බර පෝය.",
  },
  {
    id: "p-6",
    name: "නිකිණි පුර පසළොස්වක පෝය",
    date: "2026 අගෝස්තු 17",
    poyaName: "Nikini Full Moon Poya",
    status: "available",
    description: "ප්‍රථම ධර්ම සංගායනාව හා පසුවස් එළඹීම සිදුවන නිකිණි පෝය.",
  },
  {
    id: "p-7",
    name: "බිනර පුර පසළොස්වක පෝය",
    date: "2026 සැප්තැම්බර් 15",
    poyaName: "Binara Full Moon Poya",
    status: "available",
    description: "මෙහෙණි සසුන ආරම්භවීම සිහිකෙරෙන උතුම් බිනර පෝය.",
  },
  {
    id: "p-8",
    name: "වප් පුර පසළොස්වක පෝය",
    date: "2026 ඔක්තෝබර් 15",
    poyaName: "Vap Full Moon Poya",
    status: "reserved",
    sponsor: "මල්ගහ කොරටුව ප්‍රදේශවාසී මහා දායක සභාව",
    description: "වස් පවාරණය හා මහා කඨින චීවර පූජා මංගල්‍යය ආරම්භ වන පින්බිම.",
  },
  {
    id: "p-9",
    name: "ඉල් පුර පසළොස්වක පෝය",
    date: "2026 නොවැම්බර් 13",
    poyaName: "Il Full Moon Poya",
    status: "available",
    description: "පස්වග තවුසන් ඇතුළු සැටනමක් රහතන් වහන්සේලා ධර්ම ප්‍රචාරයට පිටත්කළ පෝය.",
  },
  {
    id: "p-10",
    name: "උඳුවප් පුර පසළොස්වක පෝය",
    date: "2026 දෙසැම්බර් 13",
    poyaName: "Unduvap Full Moon Poya",
    status: "available",
    description: "සංඝමිත්තා මහරහත් තෙරණිය ශ්‍රී මහා බෝධි අංකුරය රැගෙන වැඩමකළ පෝය.",
  },
];

const SLOT_ICONS = [Moon, Sun, Sparkles, Heart, Users, Compass, Sparkles, CheckCircle2];

export default function CalendarPage() {
  const [danaModalOpen, setDanaModalOpen] = useState(false);
  const [selectedPoya, setSelectedPoya] = useState<string>("");

  // Dynamic monthly schedule state
  const [schedule, setSchedule] = useState<MonthlyPoyaSchedule>(DEFAULT_POYA_SCHEDULE);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("monastery_monthly_poya_schedule");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.slots) && parsed.slots.length > 0) {
          setSchedule(parsed);
        }
      }
    } catch (err) {
      console.error("Error loading stored schedule:", err);
    }
  }, []);

  const handleSaveSchedule = (updatedSchedule: MonthlyPoyaSchedule) => {
    setSchedule(updatedSchedule);
    try {
      localStorage.setItem("monastery_monthly_poya_schedule", JSON.stringify(updatedSchedule));
    } catch (err) {
      console.error("Error saving schedule to localStorage:", err);
    }
  };

  const handleOpenDanaBooking = (poyaName: string) => {
    setSelectedPoya(poyaName);
    setDanaModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffc2a5]/40 border border-[#92400e]/30 text-[#92400e] text-xs font-semibold">
          <Moon className="w-3.5 h-3.5 text-[#d97706]" />
          <span>පුර පසළොස්වක පුණ්‍ය ප්‍රභා • ශ්‍රී බුද්ධ වර්ෂ 2568 - 2569</span>
        </div>

        <h1 className="font-serif-monastic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e293b] leading-tight">
          පොහෝ දින ශීල භාවනා වැඩසටහන් සහ දානමය පින්කම්
        </h1>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          සෑම පුර පසළොස්වක පොහෝ දිනකම බෙලිඅත්ත මල්ගහ කොරටුව කපුගම සුමනවංශ නා හිමි සෙනසුන් භූමියේදී පැවැත්වෙන පින්බර නිවන් මග ප්‍රතිපත්ති පූජා වැඩසටහන් මාලාව.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => handleOpenDanaBooking("පෝදා සීල දානමය දායකත්වය")}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Heart className="w-4 h-4 fill-current text-amber-200" />
            <span>පෝදා දානමය දායකත්වය වෙන්කරවා ගන්න</span>
          </button>
        </div>
      </div>

      {/* 2. DAILY 12-HOUR TIMETABLE (MONTHLY EDITABLE) */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-5 sm:p-10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[#e6dfd3] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#92400e] bg-[#ffc2a5]/40 px-2.5 py-0.5 rounded-md">
                මාසික වැඩසටහන් පෙළගැස්ම
              </span>
              <span className="text-xs text-[#64748b] font-mono">
                {schedule.poyaDate}
              </span>
            </div>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              {schedule.monthName} - සම්පූර්ණ වැඩසටහන් මාලාව
            </h2>
            {schedule.theme && (
              <p className="text-xs sm:text-sm text-[#92400e] font-medium mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>මාසික තේමාව: {schedule.theme}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#92400e] bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-sm active:scale-95 cursor-pointer text-center"
              title="පරිපාලක PIN අංකය මඟින් මාසික කාලසටහන සංස්කරණය කරන්න"
            >
              <ShieldCheck className="w-4 h-4 text-[#92400e]" />
              <span>කාලසටහන සංස්කරණය (Admin Edit)</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-[#64748b] bg-white px-3 py-2 rounded-xl border border-[#e6dfd3] text-center">
              උදෑසන 6.00 සිට සවස 5.30 දක්වා
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.slots.map((item, idx) => {
            const IconComp = SLOT_ICONS[idx % SLOT_ICONS.length];
            return (
              <div
                key={item.id || idx}
                className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-4 sm:p-5 flex gap-4 items-start shadow-sm hover:shadow transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#92400e]/10 border border-[#92400e]/20 text-[#92400e] flex items-center justify-center shrink-0 group-hover:bg-[#92400e] group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#92400e] font-mono">
                      {item.time}
                    </span>
                    <span className="text-[10px] text-[#64748b]">පියවර 0{idx + 1}</span>
                  </div>
                  <h3 className="font-serif-monastic font-semibold text-sm sm:text-base text-[#1e293b] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE MONTHLY BUDDHIST CALENDAR (දිනදර්ශනය) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
            අන්තර්ක්‍රියාකාරී මාසික දිනදර්ශනය
          </span>
          <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
            බෞද්ධ පෝදා දිනදර්ශනය
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b]">
            ශ්‍රී ලංකා සම්මත වේලාවට අනුව එක් එක් මාසයන් තෝරා පුර පසළොස්වක පොහෝ දිනයන් සහ ශාසනික වැදගත්කම අධ්‍යයනය කරන්න.
          </p>
        </div>

        <InteractiveBuddhistCalendar
          onOpenDanaBooking={(poyaName) => handleOpenDanaBooking(poyaName)}
        />
      </div>

      {/* 4. ANNUAL POYA CALENDAR TABLE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e6dfd3] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
              වාර්ෂික කාලසටහන
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              2026 / 2027 වාර්ෂික පොහෝ දින දිනදර්ශනය
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              සෑම පුර පසළොස්වක පොහොයකම දායකත්වයන් සහ පින්කම් කටයුතු සැලසුම් කරගැනීම සඳහා.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>දායකත්වය විවෘතයි</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#92400e]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>දායකත්වය වෙන්කර ඇත</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POYA_CALENDAR.map((poya) => (
            <div
              key={poya.id}
              className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-[#92400e] bg-[#ffc2a5]/30 px-2.5 py-1 rounded-lg">
                    {poya.date}
                  </span>
                  {poya.status === "reserved" ? (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                      වෙන්කර ඇත
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      විවෘතයි
                    </span>
                  )}
                </div>

                <h3 className="font-serif-monastic font-semibold text-base text-[#1e293b]">
                  {poya.name}
                </h3>
                <span className="text-[11px] text-[#64748b] font-medium block">
                  {poya.poyaName}
                </span>

                <p className="text-xs text-[#475569] mt-2.5 leading-relaxed">
                  {poya.description}
                </p>

                {poya.sponsor && (
                  <div className="mt-3 p-2 bg-[#f8f5ee] rounded-lg border border-[#e6dfd3] text-[11px] text-[#14532d]">
                    <span className="font-semibold">ප්‍රධාන දායකත්වය:</span> {poya.sponsor}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#e6dfd3] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-xs text-[#64748b]">පූර්ණ දින ශීල වැඩසටහන</span>
                <button
                  onClick={() => handleOpenDanaBooking(`${poya.name} - දානමය දායකත්වය`)}
                  className={`w-full sm:w-auto text-center text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    poya.status === "available"
                      ? "bg-[#14532d] hover:bg-[#0a3019] text-white shadow-sm"
                      : "bg-[#f1ece1] text-[#475569] hover:text-[#1e293b]"
                  }`}
                >
                  {poya.status === "available" ? "දායකත්වය වෙන්කරන්න" : "සම-දායකත්වය විමසන්න"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MEDITATION & RETREAT ADVICE */}
      <div className="bg-gradient-to-br from-[#14532d] to-[#0b331b] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
            චිත්ත සමාධිය සහ විවේකය
          </span>
          <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-amber-100">
            &quot;නත්ථි සන්ති පරං සුඛං&quot; - ශාන්තියට වඩා උතුම් සුවයක් තවත් නැත
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            වනගත සෙනසුන වෙත පැමිණෙන ඕනෑම සැදැහැවතෙකුට සිත සන්සුන් කරගැනීම සඳහා භාවනා කුටි සහ සෙවණ සහිත වෘක්ෂ මූලයන් වෙන් කර ඇත. ආනාපානසතිය සහ සතිපට්ඨානය තුළින් සසර දුකින් නිදහස් වීමට අධිෂ්ඨාන කරගනිමු.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="tel:0701174907"
              className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-[#111c2d] text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              විස්තර විමසීම්: 070 117 4907
            </a>
          </div>
        </div>
      </div>

      {/* Dana Modal */}
      <DanaBookingModal
        isOpen={danaModalOpen}
        onClose={() => setDanaModalOpen(false)}
        prefilledType={selectedPoya}
      />

      {/* Monthly Poya Schedule Editor Modal */}
      <PoyaScheduleEditorModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        currentSchedule={schedule}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}
