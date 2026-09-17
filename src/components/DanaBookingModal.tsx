"use client";

import React, { useState } from "react";
import { X, Heart, Calendar, Phone, CheckCircle2, User, MapPin } from "lucide-react";

interface DanaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledType?: string;
  prefilledDate?: string;
}

export default function DanaBookingModal({
  isOpen,
  onClose,
  prefilledType,
  prefilledDate,
}: DanaBookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    danaType: prefilledType || "දහවල් සම්බුද්ධ පූජාව සහ සංඝගත දානය (Dahawal Dana)",
    date: prefilledDate || "",
    participants: "1-5",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] rounded-2xl shadow-2xl border border-[#e6dfd3] overflow-hidden">
        {/* Header with monastic civara banner */}
        <div className="bg-[#92400e] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 fill-current text-amber-300" />
            <h3 className="font-serif-monastic text-lg font-semibold">
              දානමය දායකත්වය වෙන්කරවා ගැනීම
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif-monastic text-xl font-semibold text-[#1e293b]">
              සාදු! සාදු! ඔබගේ දානමය ලියාපදිංචිය සාර්ථකයි
            </h4>
            <p className="text-sm text-[#475569] leading-relaxed max-w-sm mx-auto">
              ඔබ වෙන්කළ දානමය දිනය සහ විස්තර පිළිබඳව සේනාසන කාර්යාලයෙන් ඔබ අමතා තහවුරු කරනු ඇත.
            </p>
            <div className="bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-xl text-left text-xs space-y-1.5 text-[#334155]">
              <p><strong>නම:</strong> {formData.name}</p>
              <p><strong>දුරකථන:</strong> {formData.phone}</p>
              <p><strong>දාන වර්ගය:</strong> {formData.danaType}</p>
              <p><strong>දිනය:</strong> {formData.date || "නියමිත වේලාව සාකච්ඡා කර තීරණය කෙරේ"}</p>
            </div>
            <p className="text-xs text-[#14532d] font-medium">
              විමසීම් සඳහා සෘජුව අමතන්න: <strong>070 117 4907</strong>
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-[#92400e] hover:bg-[#712c00] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              සම්පූර්ණයි (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-[#64748b]">
              කපුගම සුමනවංශ නා හිමි සෙනසුනේ වැඩවසන ආරණ්‍යක සංඝරත්නය උදෙසා දානමය දායකත්වයන් ලබාගැනීමට පහත තොරතුරු පුරවන්න.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                ඔබගේ සම්පූර්ණ නම *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="සුනිල් ප්‍රනාන්දු මහතා..."
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
                <User className="w-4 h-4 text-[#94a3b8] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                සම්බන්ධ කරගත හැකි දුරකථන අංකය *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07X XXX XXXX"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
                <Phone className="w-4 h-4 text-[#94a3b8] absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  දානමය ආකාරය
                </label>
                <select
                  value={formData.danaType}
                  onChange={(e) => setFormData({ ...formData, danaType: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                >
                  <option>දහවල් දානය (Dahawal Dana)</option>
                  <option>හීල් දානය (Heel Dana)</option>
                  <option>සන්ධ්‍යා ගිලන්පස පූජාව (Gilanpasa)</option>
                  <option>පෝදා ශීල දානමය දායකත්වය (Poya Sil Dana)</option>
                  <option>පිරිකර හා බෙහෙත් පූජාව (Aushadha Dana)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  අපේක්ෂිත දිනය
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                අමතර විස්තර හෝ ඉල්ලීම් (විකල්ප)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="පුණ්‍යානුමෝදනා නාමලේඛන හෝ විශේෂ අවශ්‍යතා..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#e6dfd3]">
              <div className="text-[11px] text-[#14532d] flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5" />
                <span>කාර්යාලය: 070 117 4907</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#475569] hover:bg-[#f1ece1] rounded-xl transition-colors"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#92400e] hover:bg-[#712c00] rounded-xl shadow-sm transition-colors"
                >
                  දායකත්වය ලියාපදිංචි කරන්න
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
