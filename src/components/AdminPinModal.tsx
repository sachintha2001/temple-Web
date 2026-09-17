"use client";

import React, { useState } from "react";
import { Lock, KeyRound, X, AlertCircle, ShieldCheck } from "lucide-react";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export default function AdminPinModal({
  isOpen,
  onClose,
  onSuccess,
  title = "පරිපාලක පිවිසුම (Admin Login)",
  description = "ඡායාරූප සංස්කරණය (Edit) හෝ මකාදැමීම (Delete) සඳහා කරුණාකර රහස්‍ය PIN අංකය ඇතුළත් කරන්න.",
}: AdminPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_gallery_auth", "true");
        }
        setPin("");
        setError(null);
        onSuccess();
        onClose();
      } else {
        setError(data.error || "ඇතුළත් කළ PIN අංකය වැරදියි.");
        setPin("");
      }
    } catch (err) {
      setError("සත්‍යාපනය කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#e6dfd3] bg-[#f8f5ee]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-[#92400e]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-base text-[#1e293b]">
                {title}
              </h3>
              <p className="text-[11px] text-[#64748b]">ආරක්ෂිත සත්‍යාපනය</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-[#e6dfd3]/60 transition-colors cursor-pointer"
            aria-label="වසන්න"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-[#475569] leading-relaxed">
            {description}
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#92400e]" />
              <span>පරිපාලක PIN අංකය (Admin PIN)</span>
            </label>
            <input
              type="password"
              autoFocus
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-xl border border-[#e6dfd3] bg-white text-center text-lg tracking-widest font-mono text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 focus:border-[#92400e]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors cursor-pointer"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin.trim()}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-sm cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? "තහවුරු කරමින්..." : "පිවිසෙන්න"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
