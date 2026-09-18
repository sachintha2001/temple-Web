"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import {
  DocumentItem,
  DOCUMENT_CATEGORIES,
  extractGoogleDriveId,
  buildGoogleDriveDownloadUrl,
  buildGoogleDrivePreviewUrl,
} from "@/lib/documents";

interface DocumentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onSave: (updated: DocumentItem) => void;
}

export default function DocumentEditModal({
  isOpen,
  onClose,
  document,
  onSave,
}: DocumentEditModalProps) {
  const [title, setTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[1]);
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [pageCount, setPageCount] = useState<number | "">("");
  const [fileSize, setFileSize] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setEnglishTitle(document.englishTitle || "");
      setCategory(document.category);
      setAuthor(document.author);
      setDescription(document.description);
      setPageCount(document.pageCount ?? "");
      setFileSize(document.fileSize || "");
      setGoogleDriveUrl(document.googleDriveUrl || document.downloadUrl || "");
      setError(null);
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("කරුණාකර මාතෘකාව ඇතුළත් කරන්න.");
      return;
    }

    const driveUrlTrimmed = googleDriveUrl.trim();
    const driveId = extractGoogleDriveId(driveUrlTrimmed);

    let updatedDownloadUrl = document.downloadUrl;
    let updatedPreviewUrl = document.previewUrl;

    if (driveUrlTrimmed) {
      if (driveId) {
        updatedDownloadUrl = buildGoogleDriveDownloadUrl(driveId);
        updatedPreviewUrl = buildGoogleDrivePreviewUrl(driveId);
      } else {
        updatedDownloadUrl = driveUrlTrimmed;
        updatedPreviewUrl = driveUrlTrimmed;
      }
    }

    const updated: DocumentItem = {
      ...document,
      title: title.trim(),
      englishTitle: englishTitle.trim() || undefined,
      category,
      author: author.trim() || "කපුගම සුමනවංශ නා හිමි සෙනසුන",
      description: description.trim(),
      pageCount: pageCount ? Number(pageCount) : undefined,
      fileSize: fileSize.trim() || document.fileSize,
      googleDriveUrl: driveUrlTrimmed || undefined,
      googleDriveFileId: driveId || document.googleDriveFileId,
      downloadUrl: updatedDownloadUrl,
      previewUrl: updatedPreviewUrl,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e6dfd3] bg-[#f8f5ee]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-[#92400e]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-base sm:text-lg text-[#1e293b]">
                ලේඛන තොරතුරු සංස්කරණය
              </h3>
              <p className="text-xs text-[#64748b]">පොත්පත් විස්තර සහ සබැඳි යාවත්කාලීන කරන්න</p>
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1e293b] mb-1">
              සිංහල මාතෘකාව *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e293b] mb-1">
              ඉංග්‍රීසි මාතෘකාව (English Subtitle)
            </label>
            <input
              type="text"
              value={englishTitle}
              onChange={(e) => setEnglishTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                කාණ්ඩය (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
              >
                {DOCUMENT_CATEGORIES.filter((c) => !c.includes("සියලු")).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                කර්තෘ / දේශකයන් වහන්සේ
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e293b] mb-1">
              Google Drive සබැඳිය (Shareable Link)
            </label>
            <input
              type="url"
              value={googleDriveUrl}
              onChange={(e) => setGoogleDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                පිටු ගණන
              </label>
              <input
                type="number"
                min="1"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                ගොනු ප්‍රමාණය
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e293b] mb-1">
              කෙටි විස්තරය
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors"
            >
              අවලංගු කරන්න
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>වෙනස්කම් සුරකින්න</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
