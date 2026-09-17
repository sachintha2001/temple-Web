"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { GalleryItem } from "@/lib/gallery";

interface GalleryDeleteModalProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onConfirm: (item: GalleryItem) => void;
}

export default function GalleryDeleteModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: GalleryDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    setIsDeleting(true);
    try {
      onConfirm(item);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#e6dfd3] bg-red-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-700 border border-red-200">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-base text-[#1e293b]">
                ඡායාරූපය මකා දැමීම
              </h3>
              <p className="text-[11px] text-red-600 font-semibold">තහවුරු කිරීම (Delete Confirmation)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="වසන්න"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#e6dfd3]">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[#e6dfd3]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-[#92400e] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {item.category} • {item.month}
              </span>
              <h4 className="font-medium text-xs sm:text-sm text-[#1e293b] truncate mt-1">
                {item.title}
              </h4>
            </div>
          </div>

          <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              මෙම ඡායාරූපය ගැලරියෙන් සම්පූර්ණයෙන්ම ඉවත් කිරීමට ඔබට සහතිකද? මෙම ක්‍රියාව නැවත අහෝසි කළ නොහැක.
            </p>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors cursor-pointer text-center"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "මකා දමමින්..." : "ඔව්, මකා දමන්න"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
