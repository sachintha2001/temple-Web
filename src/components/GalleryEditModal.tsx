"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Edit3,
  Save,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { GalleryItem } from "@/lib/gallery";

interface GalleryEditModalProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onClose: () => void;
  onSave: (updatedItem: GalleryItem) => void;
}

const CATEGORIES = [
  "පිංකම්",
  "පොහෝ දින",
  "දානමය පිංකම්",
  "සේනාසන සංවර්ධන",
  "සේනාසන පරිසරය",
];

const MONTHS = [
  "2026 ඔක්තෝබර්",
  "2026 සැප්තැම්බර්",
  "2026 අගෝස්තු",
  "2026 ජූලි",
  "2026 ජූනි",
  "2026 මැයි",
  "2026 අප්‍රේල්",
  "2026 මාර්තු",
];

export default function GalleryEditModal({
  isOpen,
  item,
  onClose,
  onSave,
}: GalleryEditModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("පිංකම්");
  const [month, setMonth] = useState("2026 සැප්තැම්බර්");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setCategory(item.category);
      setMonth(item.month);
      setDate(item.date || new Date().toISOString().split("T")[0]);
      setDescription(item.description || "");
      setImageUrl(item.imageUrl);
      setNewFile(null);
      setNewPreviewUrl(null);
      setErrorMessage(null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setNewFile(selected);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("කරුණාකර ඡායාරූපය සඳහා ශීර්ෂයක් ඇතුළත් කරන්න.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    let finalImageUrl = newPreviewUrl || imageUrl;

    try {
      if (newFile) {
        // Attempt upload through server upload proxy
        const formData = new FormData();
        formData.append("file", newFile);

        try {
          const res = await fetch("/api/gallery/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.secure_url) {
              finalImageUrl = data.secure_url;
            }
          }
        } catch (uploadErr) {
          console.warn("Image upload notice:", uploadErr);
        }
      }

      const updated: GalleryItem = {
        ...item,
        title: title.trim(),
        category,
        month,
        date: date || item.date,
        description: description.trim(),
        imageUrl: finalImageUrl,
      };

      onSave(updated);
      onClose();
    } catch (err) {
      setErrorMessage("තොරතුරු සුරැකීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = newPreviewUrl || imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e6dfd3] flex items-center justify-between bg-[#f8f5ee]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300/80 text-[#92400e]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-base sm:text-lg text-[#1e293b]">
                ඡායාරූප තොරතුරු සංස්කරණය
              </h3>
              <p className="text-xs text-[#64748b]">පරිපාලක අංශය (Admin Edit)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-[#e6dfd3]/60 transition-colors cursor-pointer"
            aria-label="වසන්න"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current / New Image Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#92400e]" />
              <span>ඡායාරූපය</span>
            </label>

            <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-dashed border-[#e6dfd3] bg-[#f8f5ee] flex flex-col items-center justify-center group">
              {displayImage ? (
                <>
                  <Image
                    src={displayImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-4 py-2 bg-white/90 hover:bg-white text-[#92400e] text-xs font-bold rounded-xl cursor-pointer shadow-md flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>වෙනත් ඡායාරූපයක් තෝරන්න</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-center p-4">
                  <Upload className="w-6 h-6 text-[#92400e]" />
                  <span className="text-xs text-[#64748b]">ඡායාරූපයක් තෝරන්න</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {newFile && (
              <p className="text-[11px] text-emerald-700 font-medium">
                ✓ නව ඡායාරූපය තෝරාගෙන ඇත: {newFile.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#92400e]" />
              <span>ශීර්ෂය (Title) *</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="උදා: නිකිණි පුර පසළොස්වක පොහෝ දින ශීල භාවනා පිංකම"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 focus:border-[#92400e]"
            />
          </div>

          {/* Category & Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#14532d]" />
                <span>වර්ගය (Category)</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#92400e]" />
                <span>මාසය (Month)</span>
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 focus:border-[#92400e]"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#92400e]" />
              <span>දිනය (Date)</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1e293b]">
              විස්තරය (Description - විකල්ප)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ඡායාරූපය හෝ පිංකම පිළිබඳ කෙටි සටහනක්..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-[#e6dfd3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors cursor-pointer text-center"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "සුරකිමින් පවතී..." : "වෙනස්කම් සුරකින්න"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
