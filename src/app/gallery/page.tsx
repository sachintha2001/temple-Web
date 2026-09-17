"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Upload,
  Calendar,
  Filter,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { GalleryItem, INITIAL_GALLERY_ITEMS } from "@/lib/gallery";
import CloudinaryUploadModal from "@/components/CloudinaryUploadModal";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedMonth, setSelectedMonth] = useState("සියලු මාස (All)");
  const [selectedCategory, setSelectedCategory] = useState("සියල්ල");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load custom uploaded items from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("monastery_gallery_uploads");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems([...parsed, ...INITIAL_GALLERY_ITEMS]);
        }
      }
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
  }, []);

  const handleUploadSuccess = (newItem: GalleryItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    try {
      const customOnly = updated.filter((item) => item.id.startsWith("cl-"));
      localStorage.setItem("monastery_gallery_uploads", JSON.stringify(customOnly));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  // Available months
  const months = useMemo(() => {
    const mSet = new Set<string>();
    items.forEach((item) => mSet.add(item.month));
    return ["සියලු මාස (All)", ...Array.from(mSet)];
  }, [items]);

  // Available categories
  const categories = ["සියල්ල", "පිංකම්", "පොහෝ දින", "දානමය පිංකම්", "සේනාසන සංවර්ධන", "සේනාසන පරිසරය"];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchMonth = selectedMonth === "සියලු මාස (All)" || item.month === selectedMonth;
      const matchCategory = selectedCategory === "සියල්ල" || item.category === selectedCategory;
      return matchMonth && matchCategory;
    });
  }, [items, selectedMonth, selectedCategory]);

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. HEADER & CLOUDINARY UPLOAD CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e6dfd3] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc2a5]/40 text-[#92400e] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>මාසික පිංකම් ඡායාරූප ගැලරිය (Pin Kam Gallery)</span>
          </div>
          <h1 className="font-serif-monastic text-3xl sm:text-4xl font-bold text-[#1e293b]">
            ආරණ්‍ය සේනාසන පුණ්‍ය මහෝත්සව හා මතක සටහන්
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl">
            කපුගම සුමනවංශ නා හිමි සෙනසුනේ මාසිකව පැවැත්වෙන පින්කම්, වස්සාන කාලීන පූජාවන්, ශීල සමාදාන සහ සේනාසන සංවර්ධන මතක සටහන්.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#14532d] hover:bg-[#0d3d20] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>පිංකම් ඡායාරූප එක්කරන්න (Upload)</span>
          </button>
        </div>
      </div>

      {/* Peaceful Monastic Note */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#475569]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#92400e]" />
          <span>
            සේනාසන වාර්ෂික හා මාසික පුණ්‍ය කටයුතු පිළිබඳ ඡායාරූප එකතුව.
          </span>
        </div>
        <p className="text-[11px] text-[#14532d] font-semibold">
          කපුගම සුමනවංශ නා හිමි සෙනසුන • බෙලිඅත්ත
        </p>
      </div>

      {/* 2. FILTERS: MONTHS & CATEGORIES */}
      <div className="space-y-3">
        {/* Month Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Calendar className="w-4 h-4 text-[#92400e] shrink-0 mr-1" />
          <span className="text-xs font-semibold text-[#1e293b] shrink-0 mr-2">මාසය:</span>
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedMonth === m
                  ? "bg-[#92400e] text-white shadow-sm"
                  : "bg-[#f8f5ee] text-[#475569] hover:bg-[#f1ece1] border border-[#e6dfd3]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-[#14532d] shrink-0 mr-1" />
          <span className="text-xs font-semibold text-[#1e293b] shrink-0 mr-2">වර්ගය:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#14532d] text-white shadow-sm"
                  : "bg-[#fdfbf7] text-[#475569] hover:bg-[#f8f5ee] border border-[#e6dfd3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MASONRY PHOTO GRID */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#f8f5ee] rounded-3xl border border-[#e6dfd3] space-y-3">
          <p className="text-sm text-[#64748b]">තෝරාගත් මාසයට හෝ වර්ගයට අදාළ ඡායාරූප හමු නොවීය.</p>
          <button
            onClick={() => {
              setSelectedMonth("සියලු මාස (All)");
              setSelectedCategory("සියල්ල");
            }}
            className="text-xs font-semibold text-[#92400e] underline"
          >
            සියලු ඡායාරූප පෙන්වන්න
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative bg-[#fdfbf7] rounded-2xl overflow-hidden border border-[#e6dfd3] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge tags */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-[#92400e]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.month}
                  </span>
                  <span className="bg-[#14532d]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>

                <button
                  aria-label="විශාල කර බලන්න"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Title inside image gradient */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-monastic font-semibold text-base leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="p-3.5 bg-[#f8f5ee] flex items-center justify-between text-[11px] text-[#64748b]">
                <span>{item.date}</span>
                <span className="text-[#92400e] font-semibold group-hover:underline flex items-center gap-1">
                  <span>විශාල කර බලන්න</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. LIGHTBOX MODAL */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-10 right-0 sm:right-2 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="වසන්න"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Frame */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <Image
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                fill
                className="object-contain"
              />

              {/* Previous / Next buttons */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                aria-label="පෙර ඡායාරූපය"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextLightbox}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                aria-label="මීළඟ ඡායාරූපය"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Caption */}
            <div className="w-full mt-3 p-4 rounded-xl bg-slate-900/90 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-amber-400">
                    {currentLightboxItem.month}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-emerald-400">
                    {currentLightboxItem.category}
                  </span>
                </div>
                <h4 className="font-serif-monastic font-semibold text-base sm:text-lg">
                  {currentLightboxItem.title}
                </h4>
                {currentLightboxItem.description && (
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentLightboxItem.description}
                  </p>
                )}
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-mono">
                {currentLightboxItem.date}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Upload Modal */}
      <CloudinaryUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
