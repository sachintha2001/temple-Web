"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { MonthlyPoyaSchedule, ScheduleSlot, DEFAULT_POYA_SCHEDULE } from "@/data/poyaSchedule";

interface PoyaScheduleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchedule: MonthlyPoyaSchedule;
  onSave: (updatedSchedule: MonthlyPoyaSchedule) => void;
}

const PRESET_TEMPLATES: { label: string; data: Partial<MonthlyPoyaSchedule> }[] = [
  {
    label: "මැදින් පෝය (මාර්තු)",
    data: {
      monthName: "මැදින් පුර පසළොස්වක",
      poyaDate: "2026 මාර්තු 23",
      theme: "සතිපට්ඨාන භාවනා අභ්‍යාසය හා ධර්මානුශාසනාව",
    },
  },
  {
    label: "බක් පෝය (අප්‍රේල්)",
    data: {
      monthName: "බක් පුර පසළොස්වක",
      poyaDate: "2026 අප්‍රේල් 21",
      theme: "ආනාපානසති චිත්ත ඒකාග්‍රතාවය හා ධර්ම සාකච්ඡාව",
    },
  },
  {
    label: "වෙසක් පෝය (මැයි - තෙමඟුල)",
    data: {
      monthName: "වෙසක් පුර පසළොස්වක (තෙමඟුල් මහා පින්කම)",
      poyaDate: "2026 මැයි 20",
      theme: "සම්බුද්ධ තෙමඟුල් මහා ශීල භාවනා හා ආලෝක පූජාව",
    },
  },
  {
    label: "පොසොන් පෝය (ජූනි - ශාසනික පිංකම)",
    data: {
      monthName: "පොසොන් පුර පසළොස්වක",
      poyaDate: "2026 ජූනි 19",
      theme: "මිහිඳු මාහිමි ධර්ම දූත පණිවිඩය හා විදර්ශනා භාවනාව",
    },
  },
  {
    label: "ඇසළ පෝය (ජූලි - වස්සානය)",
    data: {
      monthName: "ඇසළ පුර පසළොස්වක (වස් ආරාධනා පිංකම)",
      poyaDate: "2026 ජූලි 18",
      theme: "ධම්මචක්කප්පවත්තන සූත්‍ර දේශනාව හා වස්සාන කාලීන ශීල පූජාව",
    },
  },
];

export default function PoyaScheduleEditorModal({
  isOpen,
  onClose,
  currentSchedule,
  onSave,
}: PoyaScheduleEditorModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Editable fields
  const [formData, setFormData] = useState<MonthlyPoyaSchedule>(currentSchedule);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifyingPin(true);
    setPinError(null);

    try {
      const res = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPinError(null);
        setFormData(currentSchedule);
      } else {
        setPinError(data.error || "ඇතුළත් කළ PIN අංකය වැරදියි.");
        setPinInput("");
      }
    } catch (err) {
      setPinError("සත්‍යාපනය කිරීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleApplyPreset = (preset: Partial<MonthlyPoyaSchedule>) => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  const handleSlotChange = (index: number, field: keyof ScheduleSlot, value: string) => {
    const updatedSlots = [...formData.slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setFormData({ ...formData, slots: updatedSlots });
  };

  const handleAddSlot = () => {
    const newSlot: ScheduleSlot = {
      id: "slot-" + Date.now(),
      time: "ප.ව. 00:00 - 00:00",
      title: "නව වැඩසටහන් අංගය",
      desc: "වැඩසටහන් විස්තරය හෝ අනුශාසනා හිමිපාණන්ගේ විස්තර.",
    };
    setFormData({ ...formData, slots: [...formData.slots, newSlot] });
  };

  const handleDeleteSlot = (index: number) => {
    if (formData.slots.length <= 1) return;
    const updatedSlots = formData.slots.filter((_, i) => i !== index);
    setFormData({ ...formData, slots: updatedSlots });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (confirm("කාලසටහන පෙරනිමි සැකසුම්වලට නැවත පත් කිරීමට අවශ්‍යද?")) {
      setFormData(DEFAULT_POYA_SCHEDULE);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#92400e] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif-monastic text-base font-semibold">
                {isAuthenticated
                  ? "පෝදා සම්පූර්ණ වැඩසටහන් මාලාව සංස්කරණය"
                  : "පරිපාලක පිවිසුම (Admin Authentication)"}
              </h3>
              <p className="text-[11px] text-amber-200">
                මාසික පොහෝ දින කාලසටහන යාවත්කාලීන කිරීම
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PIN AUTHENTICATION */}
        {!isAuthenticated ? (
          <form onSubmit={handleVerifyPin} className="p-8 space-y-5 text-center my-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif-monastic font-semibold text-lg text-[#1e293b]">
                සේනාසන පරිපාලක PIN අංකය ඇතුළත් කරන්න
              </h4>
              <p className="text-xs text-[#64748b] max-w-xs mx-auto">
                මාසික කාලසටහන වෙනස් කිරීම සඳහා කරුණාකර රහස්‍ය PIN අංකය ඇතුළත් කරන්න.
              </p>
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2 max-w-sm mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="max-w-xs mx-auto">
              <input
                type="password"
                maxLength={8}
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full text-center tracking-widest text-xl font-mono font-bold py-3 px-4 rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
              />
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-[#f1ece1] rounded-xl transition-colors"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                disabled={isVerifyingPin}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] disabled:opacity-60 rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                {isVerifyingPin ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                )}
                <span>තහවුරු කර පිවිසෙන්න</span>
              </button>
            </div>
          </form>
        ) : savedSuccess ? (
          <div className="p-12 text-center space-y-3 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif-monastic text-xl font-semibold text-[#1e293b]">
              කාලසටහන සාර්ථකව යාවත්කාලීන විය!
            </h4>
            <p className="text-xs text-[#64748b]">
              වෙබ් අඩවියේ නව මාසික වැඩසටහන් පෙළගැස්ම දැන් සජීවීව දිස්වේ.
            </p>
          </div>
        ) : (
          /* STEP 2: SCHEDULE EDITOR FORM */
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Presets */}
            <div>
              <span className="text-xs font-semibold text-[#1e293b] block mb-2">
                ක්ෂණික මාසික සැකිලි (Quick Templates):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(tmpl.data)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f1ece1] hover:bg-[#ffc2a5]/40 text-[#334155] border border-[#e6dfd3] transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#d97706]" />
                    <span>{tmpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Month Name & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  පෝය මාසය / නම *
                </label>
                <input
                  type="text"
                  required
                  value={formData.monthName}
                  onChange={(e) => setFormData({ ...formData, monthName: e.target.value })}
                  placeholder="උදා: මැදින් පුර පසළොස්වක..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  පෝදා දිනය *
                </label>
                <input
                  type="text"
                  required
                  value={formData.poyaDate}
                  onChange={(e) => setFormData({ ...formData, poyaDate: e.target.value })}
                  placeholder="උදා: 2026 මාර්තු 23..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
              </div>
            </div>

            {/* Monthly Theme */}
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                මාසික තේමාව හෝ ප්‍රධාන අරමුණ
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="උදා: සතිපට්ඨාන භාවනා අභ්‍යාසය හා ධර්මානුශාසනාව..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
              />
            </div>

            {/* Schedule Slots Editor */}
            <div className="space-y-3 pt-2 border-t border-[#e6dfd3]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1e293b]">
                  දෛනික වැඩසටහන් පෙළගැස්ම ({formData.slots.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="px-3 py-1 text-xs font-semibold text-[#14532d] bg-[#b1f2be]/40 hover:bg-[#b1f2be]/70 rounded-lg border border-[#14532d]/20 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>අලුත් අංගයක් එක්කරන්න</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.slots.map((slot, idx) => (
                  <div
                    key={slot.id || idx}
                    className="p-3.5 rounded-2xl bg-[#f8f5ee] border border-[#e6dfd3] space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#92400e]">
                        අංගය 0{idx + 1}
                      </span>
                      {formData.slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="ඉවත් කරන්න"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          required
                          value={slot.time}
                          onChange={(e) => handleSlotChange(idx, "time", e.target.value)}
                          placeholder="පෙ.ව. 06:00 - 06:30"
                          className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#e6dfd3] bg-white focus:outline-none focus:ring-1 focus:ring-[#92400e] text-[#1e293b]"
                        />
                      </div>
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          required
                          value={slot.title}
                          onChange={(e) => handleSlotChange(idx, "title", e.target.value)}
                          placeholder="වැඩසටහන් නම..."
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#e6dfd3] bg-white focus:outline-none focus:ring-1 focus:ring-[#92400e] text-[#1e293b]"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={slot.desc}
                        onChange={(e) => handleSlotChange(idx, "desc", e.target.value)}
                        placeholder="විස්තරය හෝ අනුශාසනා හිමිපාණන්..."
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-[#e6dfd3] bg-white focus:outline-none focus:ring-1 focus:ring-[#92400e] text-[#475569]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#e6dfd3] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-[#64748b] hover:text-[#92400e] flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>පෙරනිමියට යළි සකසන්න</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#475569] hover:bg-[#f1ece1] rounded-xl transition-colors"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>කාලසටහන සුරකින්න</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
