"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { SINHALA_MONTHS, SINHALA_WEEKDAYS, getBuddhistEraYear } from "@/data/buddhistCalendar";

interface SriLankaClockProps {
  compact?: boolean;
  onOpenCalendar?: () => void;
}

export default function SriLankaClock({ compact = false, onOpenCalendar }: SriLankaClockProps) {
  const [mounted, setMounted] = useState(false);
  const [timeState, setTimeState] = useState({
    timeStr: "12:00:00",
    ampm: "PM",
    sinhalaDate: "2026 මාර්තු 23",
    weekday: "සඳුදා",
    beYear: 2568,
  });

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      try {
        const now = new Date();

        // 1. Get Colombo / Sri Lanka Time parts
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const timeParts = timeFormatter.formatToParts(now);
        const hour = timeParts.find((p) => p.type === "hour")?.value || "12";
        const minute = timeParts.find((p) => p.type === "minute")?.value || "00";
        const second = timeParts.find((p) => p.type === "second")?.value || "00";
        const dayPeriod = timeParts.find((p) => p.type === "dayPeriod")?.value?.toUpperCase() || "PM";

        // 2. Get Date parts in Asia/Colombo
        const dateFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Colombo",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          weekday: "short",
        });
        const dateParts = dateFormatter.formatToParts(now);
        const year = parseInt(dateParts.find((p) => p.type === "year")?.value || "2026", 10);
        const monthNum = parseInt(dateParts.find((p) => p.type === "month")?.value || "3", 10); // 1-12
        const dayNum = parseInt(dateParts.find((p) => p.type === "day")?.value || "23", 10);
        const weekdayEn = dateParts.find((p) => p.type === "weekday")?.value || "Mon";

        // Map to Sinhala
        const monthName = SINHALA_MONTHS[monthNum - 1] || "මාර්තු";
        const weekdayObj = SINHALA_WEEKDAYS.find((w) => weekdayEn.startsWith(w.en)) || SINHALA_WEEKDAYS[1];
        const beYear = getBuddhistEraYear(year, monthNum);

        setTimeState({
          timeStr: `${hour}:${minute}:${second}`,
          ampm: dayPeriod,
          sinhalaDate: `${year} ${monthName} ${dayNum}`,
          weekday: weekdayObj.full,
          beYear,
        });
      } catch (err) {
        console.error("Clock update error:", err);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f5ee] border border-[#e6dfd3] text-xs text-[#64748b]">
        <Clock className="w-3.5 h-3.5 animate-pulse text-[#92400e]" />
        <span>ශ්‍රී ලංකා වේලාව පූරණය වේ...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14532d]/10 border border-[#14532d]/20 text-[#14532d]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="font-mono font-bold tracking-wider text-xs sm:text-[13px] text-[#0f3d20]">
            {timeState.timeStr}
          </span>
          <span className="text-[10px] font-semibold uppercase px-1 py-0.2 rounded bg-white/80 text-[#14532d]">
            {timeState.ampm}
          </span>
        </div>

        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#92400e]/10 hover:bg-[#92400e]/20 border border-[#92400e]/20 text-[#92400e] font-semibold text-xs transition-colors cursor-pointer"
            title="දිනදර්ශනය විවෘත කරන්න"
          >
            <CalendarIcon className="w-3 h-3 text-[#92400e]" />
            <span className="hidden sm:inline">{timeState.weekday},</span>
            <span>{timeState.sinhalaDate}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-4 py-1.5 bg-[#fdfbf7] border-b border-[#e6dfd3]/90 text-xs text-[#475569]">
      {/* Left: Live Sri Lanka Digital Clock */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14532d]/10 border border-[#14532d]/25 text-[#14532d]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-[11px] font-semibold text-[#14532d] hidden sm:inline">
            ශ්‍රී ලංකා වේලාව:
          </span>
          <span className="font-mono font-bold tracking-wider text-xs sm:text-sm text-[#0f3d20]">
            {timeState.timeStr}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1 py-0.5 rounded bg-white border border-[#14532d]/20 text-[#14532d]">
            {timeState.ampm}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[#64748b]">
          <span>•</span>
          <span className="font-medium text-[#1e293b]">{timeState.weekday}</span>
          <span>•</span>
          <span>{timeState.sinhalaDate}</span>
          <span className="text-[10px] bg-[#ffc2a5]/40 text-[#92400e] font-semibold px-2 py-0.5 rounded-full border border-[#92400e]/20">
            ශ්‍රී බු.ව. {timeState.beYear}
          </span>
        </div>
      </div>

      {/* Right: Quick Calendar Link & Poya Prompt */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-[#92400e] border border-amber-300/80 font-semibold text-[11px] sm:text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            title="බෞද්ධ පෝදා දිනදර්ශනය විවෘත කරන්න"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#92400e]" />
            <span>දිනදර්ශනය (Calendar)</span>
          </button>
        )}
      </div>
    </div>
  );
}
