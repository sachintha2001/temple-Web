"use client";

import React from "react";
import {
  X,
  Download,
  ExternalLink,
  BookOpen,
  FileText,
  Share2,
} from "lucide-react";
import {
  DocumentItem,
  buildGoogleDriveDownloadUrl,
  MONASTERY_DRIVE_FOLDER_URL,
} from "@/lib/documents";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  document: DocumentItem | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  isOpen,
  document,
  onClose,
}: DocumentPreviewModalProps) {
  if (!isOpen || !document) return null;

  const downloadUrl = document.googleDriveFileId
    ? buildGoogleDriveDownloadUrl(document.googleDriveFileId)
    : document.downloadUrl || MONASTERY_DRIVE_FOLDER_URL;

  const previewSrc = document.googleDriveFileId
    ? `https://drive.google.com/file/d/${document.googleDriveFileId}/preview`
    : document.previewUrl || document.downloadUrl;

  const isGoogleDriveFolder =
    previewSrc.includes("/folders/") || previewSrc === MONASTERY_DRIVE_FOLDER_URL;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: `${document.title} - කපුගම සුමනවංශ නා හිමි සෙනසුන (අරණ්‍ය සේනාසනය)`,
          url: window.location.href,
        });
      } catch (e) {
        // Ignored if user cancels share
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("සබැඳිය පිටපත් කරගන්නා ලදී (Link copied)!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#e6dfd3] bg-[#f8f5ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-[#92400e] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif-monastic font-bold text-sm sm:text-base text-[#1e293b] truncate">
                {document.title}
              </h3>
              <p className="text-[11px] text-[#64748b] truncate">
                {document.author} • {document.category}
                {document.pageCount ? ` • ${document.pageCount} පිටු` : ""}
                {document.fileSize ? ` • ${document.fileSize}` : ""}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              title="සබැඳිය බෙදාගන්න"
              className="p-2 rounded-xl border border-[#e6dfd3] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1ece1] transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* External Google Drive Link */}
            <a
              href={document.googleDriveUrl || downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Google Drive හි විවෘත කරන්න"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-[#92400e] text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Drive හි විවෘත කරන්න</span>
            </a>

            {/* Direct Download Button */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#92400e] hover:bg-[#712c00] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>බාගත කරන්න (Download)</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#64748b] hover:text-[#1e293b] hover:bg-[#e6dfd3]/60 transition-colors"
              aria-label="වසන්න"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 w-full bg-[#1e293b] relative overflow-hidden">
          {isGoogleDriveFolder ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-serif-monastic text-xl font-bold text-white max-w-md">
                {document.title}
              </h4>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                මෙම ලේඛනය විහාරස්ථානයේ නිල Google Drive සදහම් එකතුව (PDF Archive) තුළ සුරක්ෂිතව ගබඩා කර ඇත.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Google Drive මඟින් බාගත කරන්න</span>
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={previewSrc}
              title={document.title}
              className="w-full h-full border-0"
              allow="autoplay"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
}
