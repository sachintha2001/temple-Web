"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Edit3,
  Trash2,
  Lock,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { GalleryItem, INITIAL_GALLERY_ITEMS } from "@/lib/gallery";
import CloudinaryUploadModal from "@/components/CloudinaryUploadModal";
import GalleryEditModal from "@/components/GalleryEditModal";
import GalleryDeleteModal from "@/components/GalleryDeleteModal";
import AdminPinModal from "@/components/AdminPinModal";

const STORAGE_KEY = "monastery_gallery_items";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedMonth, setSelectedMonth] = useState("සියලු මාස (All)");
  const [selectedCategory, setSelectedCategory] = useState("සියල්ල");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Edit & Delete modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check admin session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_gallery_auth");
      if (auth === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  // Save items to localStorage helper
  const saveItemsToStorage = useCallback((updated: GalleryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, []);

  // Load custom uploaded/edited items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }

      // Legacy fallback
      const legacy = localStorage.getItem("monastery_gallery_uploads");
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          const merged = [...parsedLegacy, ...INITIAL_GALLERY_ITEMS];
          setItems(merged);
          saveItemsToStorage(merged);
          return;
        }
      }

      setItems(INITIAL_GALLERY_ITEMS);
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
  }, [saveItemsToStorage]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auth gate helper: executes action if admin, otherwise opens PIN modal
  const handleActionWithAuth = (action: () => void) => {
    if (isAdmin) {
      action();
    } else {
      setPendingAction(() => action);
      setAdminPinModalOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setToastMessage("පරිපාලක පිවිසුම සාර්ථකයි.");
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_gallery_auth");
    }
    setToastMessage("පරිපාලක ගිණුමෙන් සාර්ථකව පිටවිය.");
  };

  // Upload handler
  const handleUploadSuccess = (newItem: GalleryItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    saveItemsToStorage(updated);
    setIsAdmin(true);
    setToastMessage("නව ඡායාරූපය සාර්ථකව එක්කරන ලදී.");
  };

  // Edit handlers
  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: GalleryItem) => {
    const updated = items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    setItems(updated);
    saveItemsToStorage(updated);
    setToastMessage("ඡායාරූප තොරතුරු සාර්ථකව යාවත්කාලීන කරන ලදී.");
  };

  // Delete handlers
  const handleOpenDelete = (item: GalleryItem) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (itemToDelete: GalleryItem) => {
    const updated = items.filter((i) => i.id !== itemToDelete.id);
    setItems(updated);
    saveItemsToStorage(updated);
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
    }
    setToastMessage("ඡායාරූපය සාර්ථකව මකා දමන ලදී.");
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    if (window.confirm("සියලුම පෙරනිමි ඡායාරූප නැවත ලබාගැනීමට ඔබට සහතිකද?")) {
      setItems(INITIAL_GALLERY_ITEMS);
      saveItemsToStorage(INITIAL_GALLERY_ITEMS);
      setToastMessage("පෙරනිමි ඡායාරූප සාර්ථකව යළි පිහිටුවන ලදී.");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14532d] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER & ACTIONS */}
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

        {/* Action Buttons: Upload & Admin Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Admin Login / Logout status */}
          {!isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setPendingAction(null);
                setAdminPinModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl font-semibold text-[#92400e] bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-xs active:scale-95"
              title="පරිපාලක පිවිසුම"
            >
              <Lock className="w-4 h-4" />
              <span>පරිපාලක (Admin)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Admin Mode Active</span>
                <span className="sm:hidden">Admin</span>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
                title="පරිපාලක පිටවීම"
              >
                පිටවෙන්න
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#14532d] hover:bg-[#0d3d20] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>ඡායාරූප එක්කරන්න (Upload)</span>
          </button>
        </div>
      </div>

      {/* 2. ADMIN CONTROL BANNER (Visible when admin is logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-50 to-[#fdfbf7] border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[#92400e]">
                  පරිපාලක ප්‍රකාරය සක්‍රියයි (Admin Mode Active)
                </span>
              </div>
              <p className="text-[11px] text-[#712c00]/80 mt-0.5">
                ඡායාරූප සංස්කරණය (Edit) සඳහා කහ පැහැති බොත්තම ද, මකා දැමීම (Delete) සඳහා රතු පැහැති බොත්තම ද භාවිතා කරන්න.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="පෙරනිමි ඡායාරූප නැවත ලබාගන්න"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>පෙරනිමි යළි පිහිටුවන්න (Reset)</span>
            </button>
          </div>
        </div>
      )}

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

      {/* 3. FILTERS: MONTHS & CATEGORIES */}
      <div className="space-y-3">
        {/* Month Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Calendar className="w-4 h-4 text-[#92400e] shrink-0 mr-1" />
          <span className="text-xs font-semibold text-[#1e293b] shrink-0 mr-2">මාසය:</span>
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
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

      {/* 4. MASONRY PHOTO GRID */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-[#f8f5ee] rounded-3xl border border-[#e6dfd3] space-y-3">
          <p className="text-sm text-[#64748b]">තෝරාගත් මාසයට හෝ වර්ගයට අදාළ ඡායාරූප හමු නොවීය.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedMonth("සියලු මාස (All)");
              setSelectedCategory("සියල්ල");
            }}
            className="text-xs font-semibold text-[#92400e] underline cursor-pointer"
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
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className="bg-[#92400e]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.month}
                  </span>
                  <span className="bg-[#14532d]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Admin Quick Action Pills on Card */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(item);
                      }}
                      className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                      title="ඡායාරූපය සංස්කරණය කරන්න (Edit)"
                      aria-label="සංස්කරණය"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(item);
                      }}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                      title="ඡායාරූපය මකා දමන්න (Delete)"
                      aria-label="මකා දමන්න"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Fullscreen Magnify button (when not admin or bottom right) */}
                {!isAdmin && (
                  <button
                    aria-label="විශාල කර බලන්න"
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}

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

                <div className="flex items-center gap-3">
                  {/* Non-admin can also trigger edit/delete which prompts PIN */}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionWithAuth(() => handleOpenEdit(item));
                      }}
                      className="text-[#64748b] hover:text-[#92400e] text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="පරිපාලක සංස්කරණය"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>සංස්කරණය</span>
                    </button>
                  )}

                  <span className="text-[#92400e] font-semibold group-hover:underline flex items-center gap-1">
                    <span>විශාල කර බලන්න</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. LIGHTBOX MODAL */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 sm:-top-11 sm:right-0 text-white bg-black/60 sm:bg-transparent hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors z-20 cursor-pointer"
              aria-label="වසන්න"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Frame */}
            <div className="relative w-full h-[55vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <Image
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                fill
                className="object-contain"
              />

              {/* Previous / Next buttons */}
              <button
                type="button"
                onClick={handlePrevLightbox}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                aria-label="පෙර ඡායාරූපය"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNextLightbox}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                aria-label="මීළඟ ඡායාරූපය"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Caption & Admin Actions */}
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

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs text-slate-400 font-mono hidden sm:inline mr-2">
                  {currentLightboxItem.date}
                </span>

                {/* Edit Button in Lightbox */}
                <button
                  type="button"
                  onClick={() =>
                    handleActionWithAuth(() => handleOpenEdit(currentLightboxItem))
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>සංස්කරණය</span>
                </button>

                {/* Delete Button in Lightbox */}
                <button
                  type="button"
                  onClick={() =>
                    handleActionWithAuth(() => handleOpenDelete(currentLightboxItem))
                  }
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>මකා දමන්න</span>
                </button>
              </div>
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

      {/* Gallery Edit Modal */}
      <GalleryEditModal
        isOpen={editModalOpen}
        item={editingItem}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Gallery Delete Confirmation Modal */}
      <GalleryDeleteModal
        isOpen={deleteModalOpen}
        item={deletingItem}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Admin PIN Verification Modal */}
      <AdminPinModal
        isOpen={adminPinModalOpen}
        onClose={() => {
          setAdminPinModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
