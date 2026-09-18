"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PoyaCalendarEvent } from "@/app/api/calendar/poya/route";

interface PoyaDanaMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: PoyaCalendarEvent | null;
  onSave: (updated: PoyaCalendarEvent) => void;
}

export default function PoyaDanaMarkModal({
  isOpen,
  onClose,
  event,
  onSave,
}: PoyaDanaMarkModalProps) {
  const [status, setStatus] = useState<"available" | "reserved">("available");
  const [sponsor, setSponsor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setStatus(event.status);
      setSponsor(event.sponsor || "");
      setError(null);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "reserved" && !sponsor.trim()) {
      setError("කරුණාකර දායකත්වය භාරගත් පවුලේ හෝ දායක සභාවේ නම ඇතුළත් කරන්න.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/calendar/poya", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          status,
          sponsor: status === "reserved" ? sponsor.trim() : "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "තොරතුරු සුරැකීම අසාර්ථක විය.");
      }

      const updated: PoyaCalendarEvent = {
        ...event,
        status,
        sponsor: status === "reserved" ? sponsor.trim() : "",
      };

      onSave(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "දායකත්ව තොරතුරු යාවත්කාලීන කිරීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e6dfd3] bg-[#f8f5ee]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-[#92400e]">
              <Heart className="w-5 h-5 fill-current text-[#92400e]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#92400e]">
                <ShieldCheck className="w-3 h-3" />
                <span>පරිපාලක පාලනය (Admin Only)</span>
              </div>
              <h3 className="font-serif-monastic font-bold text-base sm:text-lg text-[#1e293b]">
                පෝදා දායකත්වය සටහන් කිරීම
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-[#e6dfd3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Selected Poya Highlight Box */}
          <div className="bg-[#f1ece1]/70 border border-[#e6dfd3] rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#92400e] font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </span>
              <span className="font-mono text-[11px] bg-white/70 px-2 py-0.5 rounded-md text-[#64748b]">
                {event.poyaName}
              </span>
            </div>
            <h4 className="font-serif-monastic font-bold text-lg text-[#1e293b]">
              {event.name}
            </h4>
            <p className="text-xs text-[#64748b] leading-relaxed">
              {event.description}
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1e293b]">
              දායකත්ව තත්ත්වය (Dana Status) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Available */}
              <button
                type="button"
                onClick={() => setStatus("available")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  status === "available"
                    ? "bg-emerald-50/80 border-emerald-500 shadow-xs text-emerald-900 ring-2 ring-emerald-500/20"
                    : "bg-white border-[#e6dfd3] text-[#475569] hover:bg-[#f8f5ee]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>දායකත්වය විවෘතයි</span>
                  </span>
                  {status === "available" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">
                  තවමත් කිසිවෙකු භාරගෙන නොමැත. සැදැහැවතුන්ට වෙන්කරගත හැක.
                </p>
              </button>

              {/* Option 2: Reserved */}
              <button
                type="button"
                onClick={() => setStatus("reserved")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  status === "reserved"
                    ? "bg-amber-50/90 border-amber-600 shadow-xs text-amber-950 ring-2 ring-amber-600/20"
                    : "bg-white border-[#e6dfd3] text-[#475569] hover:bg-[#f8f5ee]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-amber-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>දායකත්වය භාරගෙන ඇත</span>
                  </span>
                  {status === "reserved" && (
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">
                  දායක පවුලක් හෝ දායක සභාව විසින් මෙම පෝදා දානය භාරගෙන ඇත.
                </p>
              </button>
            </div>
          </div>

          {/* Sponsor Input field (Shown when reserved or available) */}
          {status === "reserved" ? (
            <div className="space-y-1.5 bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-2xl animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#92400e]" />
                <span>දායකත්වය භාරගත් සැදැහැති පවුල / දායක සභාවේ නම *</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                placeholder="උදා: කපුගම කුලරත්න පවුල සහ දායක සභාව..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
              />
              <p className="text-[10.5px] text-[#64748b] pt-0.5">
                මෙම නම වෙබ් අඩවියේ වාර්ෂික දිනදර්ශනයේ ප්‍රධාන දායකත්වය ලෙස ප්‍රදර්ශනය වේ.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>මෙම පොහොය දායකත්වය විවෘත කර සුරැකූ පසු පෙර තිබූ දායක නම් ඉවත් වේ.</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 border-t border-[#e6dfd3] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSaving ? "සුරකිමින් පවතී..." : "වෙනස්කම් සුරකින්න"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
