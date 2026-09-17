"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  Heart,
  X,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  SINHALA_MONTHS,
  SINHALA_WEEKDAYS,
  getPoyaForDate,
  getNextPoyaFromDate,
  getBuddhistEraYear,
  PoyaDayInfo,
} from "@/data/buddhistCalendar";

interface InteractiveBuddhistCalendarProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenDanaBooking?: (poyaName: string) => void;
}

export default function InteractiveBuddhistCalendar({
  isModal = false,
  isOpen = true,
  onClose,
  onOpenDanaBooking,
}: InteractiveBuddhistCalendarProps) {
  // Use Sri Lanka current date
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1); // 1 - 12
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());

  // Real today markers
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
    setSelectedDay(todayDay);
  };

  // Compute month layout
  const { daysInMonth, startDayOffset, daysArray } = useMemo(() => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysCount = new Date(currentYear, currentMonth, 0).getDate();
    return {
      daysInMonth: daysCount,
      startDayOffset: firstDay,
      daysArray: Array.from({ length: daysCount }, (_, i) => i + 1),
    };
  }, [currentYear, currentMonth]);

  // Selected date info
  const selectedPoyaInfo: PoyaDayInfo | undefined = useMemo(() => {
    return getPoyaForDate(currentYear, currentMonth, selectedDay);
  }, [currentYear, currentMonth, selectedDay]);

  // Next upcoming poya
  const nextPoya = useMemo(() => {
    const fromDate = new Date(currentYear, currentMonth - 1, selectedDay);
    return getNextPoyaFromDate(fromDate);
  }, [currentYear, currentMonth, selectedDay]);

  const sinhalaMonthName = SINHALA_MONTHS[currentMonth - 1];
  const beYear = getBuddhistEraYear(currentYear, currentMonth);

  if (isModal && !isOpen) return null;

  const content = (
    <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-3xl p-5 sm:p-7 shadow-xl w-full max-w-2xl mx-auto space-y-6">
      {/* 1. CALENDAR HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dfd3] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#92400e] bg-[#ffc2a5]/40 px-2.5 py-0.5 rounded-full border border-[#92400e]/20 flex items-center gap-1">
              <Moon className="w-3 h-3 text-[#d97706]" />
              <span>ශ්‍රී බුද්ධ වර්ෂ {beYear}</span>
            </span>
            <button
              onClick={handleJumpToToday}
              className="text-[11px] text-[#64748b] hover:text-[#92400e] underline cursor-pointer"
            >
              අද දිනට (Today)
            </button>
          </div>
          <h2 className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#1e293b] flex items-center gap-2">
            <span>{currentYear} {sinhalaMonthName}</span>
            <span className="text-xs font-normal text-[#64748b]">
              ({new Date(currentYear, currentMonth - 1).toLocaleString("en-US", { month: "long" })})
            </span>
          </h2>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            aria-label="පසුගිය මාසය"
            className="p-2 rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] hover:bg-[#e6dfd3] text-[#1e293b] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            aria-label="මීළඟ මාසය"
            className="p-2 rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] hover:bg-[#e6dfd3] text-[#1e293b] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors ml-2 cursor-pointer"
              title="වසන්න"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. WEEKDAYS HEADER */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
        {SINHALA_WEEKDAYS.map((wd, i) => (
          <div
            key={wd.short}
            className={`py-1.5 rounded-lg text-xs font-bold ${
              i === 0 ? "text-[#b91c1c] bg-red-50/70" : "text-[#475569] bg-[#f8f5ee]"
            }`}
          >
            <span className="block text-[11px] sm:text-xs">{wd.short}</span>
            <span className="block text-[9px] text-[#94a3b8] font-mono font-normal">
              {wd.en}
            </span>
          </div>
        ))}
      </div>

      {/* 3. DAYS GRID */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Leading empty slots */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
        ))}

        {/* Month days */}
        {daysArray.map((day) => {
          const isToday =
            currentYear === todayYear && currentMonth === todayMonth && day === todayDay;
          const isSelected = day === selectedDay;
          const poyaInfo = getPoyaForDate(currentYear, currentMonth, day);
          const isPoya = Boolean(poyaInfo);

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative h-11 sm:h-13 rounded-xl p-1 flex flex-col items-center justify-between transition-all cursor-pointer ${
                isPoya
                  ? "bg-amber-100 hover:bg-amber-200 border-2 border-amber-500 shadow-sm text-amber-950 font-bold"
                  : isSelected
                  ? "bg-[#92400e] text-white shadow-md ring-2 ring-[#92400e]/40"
                  : isToday
                  ? "bg-[#14532d]/10 hover:bg-[#14532d]/20 border border-[#14532d]/40 text-[#14532d] font-bold"
                  : "bg-white hover:bg-[#f8f5ee] border border-[#e6dfd3] text-[#334155]"
              }`}
            >
              <div className="w-full flex items-center justify-between px-1">
                <span className="text-xs sm:text-sm font-semibold">{day}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" title="අද දින" />
                )}
              </div>

              {isPoya ? (
                <div className="flex items-center gap-0.5 text-[10px] text-amber-800 font-bold bg-amber-200/90 px-1 py-0.2 rounded-md truncate max-w-full">
                  <span>🌕</span>
                  <span className="hidden sm:inline truncate">{poyaInfo?.poyaMonth}</span>
                </div>
              ) : (
                <span className="text-[9px] text-[#94a3b8] opacity-0 group-hover:opacity-100">
                  {day}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. SELECTED DAY & POYA INFO CARD */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dfd3]/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#92400e]/10 text-[#92400e] flex items-center justify-center font-bold text-sm">
              {selectedDay}
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-sm sm:text-base text-[#1e293b]">
                {currentYear} {sinhalaMonthName} {selectedDay} වන දින
              </h3>
              <p className="text-[11px] text-[#64748b]">
                ශ්‍රී ලංකා සම්මත වේලාව හා බෞද්ධ දිනදර්ශනය
              </p>
            </div>
          </div>

          {selectedPoyaInfo ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-xs">
              <Moon className="w-3.5 h-3.5 fill-current" />
              <span>{selectedPoyaInfo.name}</span>
            </span>
          ) : (
            <span className="text-xs text-[#64748b] bg-white px-2.5 py-1 rounded-lg border border-[#e6dfd3]">
              සාමාන්‍ය දිනයක්
            </span>
          )}
        </div>

        {/* If selected day is Poya */}
        {selectedPoyaInfo ? (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">ශාසනික අර්ථය:</span>
              {selectedPoyaInfo.significance}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href="/calendar"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-xs"
              >
                <span>පෝදා කාලසටහන බලන්න</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {onOpenDanaBooking && (
                <button
                  onClick={() => onOpenDanaBooking(selectedPoyaInfo.name)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#14532d] bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-emerald-600" />
                  <span>දානමය දායකත්වය</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-[#64748b] pt-1">
            {nextPoya ? (
              <div className="flex items-center gap-1.5 text-[#92400e]">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>
                  මීළඟ පෝය: <strong>{nextPoya.name}</strong> ({nextPoya.year} {SINHALA_MONTHS[nextPoya.month - 1]} {nextPoya.day})
                </span>
              </div>
            ) : (
              <span>පෝදා දිනයන් පහසුවෙන් තෝරාගන්න.</span>
            )}
            <Link
              href="/calendar"
              className="text-xs font-semibold text-[#92400e] hover:underline"
            >
              වාර්ෂික කාලසටහන →
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
