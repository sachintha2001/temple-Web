"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Download,
  BookOpen,
  FileText,
  Plus,
  FolderOpen,
  ExternalLink,
  ShieldCheck,
  Lock,
  Edit3,
  Trash2,
  CheckCircle2,
  Sparkles,
  Share2,
  Upload,
} from "lucide-react";
import {
  DocumentItem,
  DOCUMENT_CATEGORIES,
  MONASTERY_DRIVE_FOLDER_URL,
  buildGoogleDriveDownloadUrl,
} from "@/lib/documents";
import DocumentUploadModal from "./DocumentUploadModal";
import DocumentEditModal from "./DocumentEditModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
import AdminPinModal from "./AdminPinModal";

const STORAGE_KEY = "monastery_pdf_documents";

export default function PublicationsClient() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("සියලු ලේඛන (All)");

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check admin session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_gallery_auth");
      if (auth === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  // Save to localStorage helper
  const saveToStorage = useCallback((updated: DocumentItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save documents to localStorage", e);
    }
  }, []);

  // Fetch documents from server API and fallback to clean localStorage
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.documents)) {
          // Filter out legacy dummy IDs (doc-1 to doc-6)
          const validDocs = data.documents.filter(
            (d: DocumentItem) => !/^doc-[1-6]$/.test(d.id)
          );
          setDocuments(validDocs);
          saveToStorage(validDocs);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Server documents fetch failed, using local storage fallback", e);
    }

    // Local storage fallback with legacy purge
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validDocs = parsed.filter(
            (d: DocumentItem) => !/^doc-[1-6]$/.test(d.id)
          );
          setDocuments(validDocs);
          saveToStorage(validDocs);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("LocalStorage read error", e);
    }

    setDocuments([]);
    setIsLoading(false);
  }, [saveToStorage]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        (doc.englishTitle && doc.englishTitle.toLowerCase().includes(q)) ||
        doc.author.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "සියලු ලේඛන (All)" || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, selectedCategory]);

  // Handle document upload
  const handleDocumentAdded = async (newDoc: DocumentItem) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveToStorage(updated);
    setToastMessage("නව PDF ලේඛනය සාර්ථකව පුස්තකාලයට එක් කරන ලදී!");

    // Persist to server
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoc),
      });
    } catch (err) {
      console.warn("Could not save document to server", err);
    }
  };

  // Handle document edit
  const handleDocumentSaved = async (updatedDoc: DocumentItem) => {
    const updated = documents.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc));
    setDocuments(updated);
    saveToStorage(updated);
    setToastMessage("ලේඛන තොරතුරු සාර්ථකව යාවත්කාලීන කෙරිණි!");

    // Persist to server
    try {
      await fetch("/api/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoc),
      });
    } catch (err) {
      console.warn("Could not update document on server", err);
    }
  };

  // Handle document delete
  const handleDeleteDocument = async (id: string, title: string) => {
    if (!isAdmin) {
      setAdminPinModalOpen(true);
      return;
    }

    if (window.confirm(`"${title}" ලේඛනය පුස්තකාලයෙන් ඉවත් කිරීමට අවශ්‍ය බව සහතිකද?`)) {
      const updated = documents.filter((doc) => doc.id !== id);
      setDocuments(updated);
      saveToStorage(updated);
      setToastMessage("ලේඛනය සාර්ථකව ඉවත් කරන ලදී.");

      // Delete on server
      try {
        await fetch(`/api/documents?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Could not delete document on server", err);
      }
    }
  };

  const handleShare = async (doc: DocumentItem) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: doc.title,
          text: `${doc.title} - කපුගම සුමනවංශ නා හිමි සෙනසුන (අරණ්‍ය සේනාසනය)`,
          url: shareUrl,
        });
      } catch (e) {
        // user cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage("සබැඳිය පිටපත් කරගන්නා ලදී (Link copied)!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14532d] text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#14532d] via-[#1b432a] to-[#111c2d] text-white p-6 sm:p-10 lg:p-12 border border-amber-600/30 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>සදහම් පුස්තකාලය & ප්‍රකාශන අංශය</span>
          </div>

          <h1 className="font-serif-monastic text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            දහම් පොත්පත් & <span className="text-amber-300">PDF බාගත කිරීම්</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed">
            පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ නිර්මල සූත්‍ර ධර්ම විවරණ, සෙත් පිරිත් පොත්, භාවනා අත්පොත් සහ ආරාමික වාරික ලේඛන මෙහිදී Google Drive මඟින් නොමිලේ බාගත කරගන්න.
          </p>

          {/* Quick Action Row */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {/* Direct Google Drive Folder Button */}
            <a
              href={MONASTERY_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Google Drive ෆෝල්ඩරය (PDF web)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Admin Upload Button */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setUploadModalOpen(true);
                } else {
                  setAdminPinModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 backdrop-blur-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>නව PDF එකක් එක් කරන්න</span>
            </button>

            {/* Admin Session Badge */}
            {isAdmin ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>පරිපාලක ක්‍රියාත්මකයි</span>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("admin_gallery_auth");
                    setIsAdmin(false);
                    setToastMessage("පරිපාලක සැසියෙන් ඉවත් විය.");
                  }}
                  className="ml-2 text-[10px] text-red-300 hover:underline"
                >
                  (Logout)
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAdminPinModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-200/70 hover:text-emerald-100 transition-colors py-2 px-2"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>පරිපාලක පිවිසුම</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6dfd3] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#92400e] uppercase tracking-wider block">
              සදහම් ප්‍රකාශන එකතුව
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              පොත්පත් සහ ලිපි ලේඛන
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              {isLoading
                ? "පූරණය වෙමින් පවතී..."
                : `උඩුගත කළ ලේඛන ${documents.length} ක් පුස්තකාලයේ පවතී`}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="පොත්පත් හෝ මාතෘකා සොයන්න..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
            />
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap sm:flex-wrap">
          {DOCUMENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#92400e] text-white shadow-sm"
                  : "bg-[#f8f5ee] text-[#334155] hover:bg-[#f1ece1] border border-[#e6dfd3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PUBLICATIONS CONTENT (CARDS / EMPTY STATE) */}
      {isLoading ? (
        <div className="text-center py-16 bg-[#f8f5ee] rounded-3xl border border-[#e6dfd3] p-8 space-y-3">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#64748b]">ලේඛන එකතුව පූරණය වෙමින් පවතී...</p>
        </div>
      ) : documents.length === 0 ? (
        /* Empty State: When no PDFs have been uploaded yet */
        <div className="text-center py-16 sm:py-20 bg-[#f8f5ee] rounded-3xl border border-[#e6dfd3] p-8 sm:p-12 space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-[#92400e] flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#1e293b]">
              තවමත් PDF ලේඛන උඩුගත කර නොමැත
            </h3>
            <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
              ඔබ Google Drive සබැඳියක් (Share Link) හෝ පරිගණකයෙන් PDF ගොනුවක් උඩුගත කළ පසු, එය මෙහි අලංකාර කාඩ්පතක් (Card) ලෙස සෘජු Google Drive Download බොත්තම සමඟ ප්‍රදර්ශනය වේ.
            </p>
          </div>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (isAdmin) {
                  setUploadModalOpen(true);
                } else {
                  setAdminPinModalOpen(true);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-[#92400e] hover:bg-[#712c00] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>පළමු PDF ලේඛනය එක් කරන්න</span>
            </button>
            <a
              href={MONASTERY_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl border border-[#e6dfd3] bg-white hover:bg-[#f1ece1] text-xs sm:text-sm font-semibold text-[#1e293b] flex items-center gap-2 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>Google Drive ෆෝල්ඩරය (PDF web)</span>
              <ExternalLink className="w-3 h-3 text-[#64748b]" />
            </a>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        /* Filter/Search empty */
        <div className="text-center py-16 bg-[#f8f5ee] rounded-3xl border border-[#e6dfd3] p-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-[#92400e] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif-monastic text-base font-bold text-[#1e293b]">
            ඔබ සෙවූ වචනයට අදාළ ලේඛන හමු නොවීය
          </h3>
          <p className="text-xs text-[#64748b]">
            වෙනත් නමක් හෝ මාතෘකාවක් යොදා සෙවුම සිදුකරන්න.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("සියලු ලේඛන (All)");
            }}
            className="mt-2 text-xs text-[#92400e] font-semibold underline"
          >
            සියලු ලේඛන පෙන්වන්න
          </button>
        </div>
      ) : (
        /* Dynamic Document Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const directDownloadUrl = doc.googleDriveFileId
              ? buildGoogleDriveDownloadUrl(doc.googleDriveFileId)
              : doc.downloadUrl || MONASTERY_DRIVE_FOLDER_URL;

            return (
              <div
                key={doc.id}
                className="bg-[#fdfbf7] hover:bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Top Badge & Metadata */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-[#92400e] text-[11px] font-semibold">
                      <FileText className="w-3 h-3 text-amber-700" />
                      <span>{doc.category}</span>
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                      {doc.pageCount && <span>{doc.pageCount} පිටු</span>}
                      {doc.fileSize && (
                        <span className="font-mono bg-[#f1ece1] px-1.5 py-0.5 rounded text-[10px]">
                          {doc.fileSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-serif-monastic font-bold text-base sm:text-lg text-[#1e293b] group-hover:text-[#92400e] transition-colors line-clamp-2">
                    {doc.title}
                  </h3>

                  {doc.englishTitle && (
                    <p className="text-[11px] text-[#94a3b8] font-medium tracking-wide mt-0.5 line-clamp-1">
                      {doc.englishTitle}
                    </p>
                  )}

                  <div className="mt-2 text-xs text-[#78350f] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{doc.author}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#475569] mt-2.5 line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-5 pt-4 border-t border-[#e6dfd3]/80 space-y-2.5">
                  {/* Download & Read Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Read Online / Preview */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setPreviewModalOpen(true);
                      }}
                      className="py-2 px-3 rounded-xl border border-[#e6dfd3] bg-white hover:bg-[#f1ece1] text-[#1e293b] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#92400e]" />
                      <span>කියවන්න</span>
                    </button>

                    {/* Google Drive Download Button */}
                    <a
                      href={directDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="py-2 px-3 rounded-xl bg-[#92400e] hover:bg-[#712c00] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-200" />
                      <span>බාගත කරන්න</span>
                    </a>
                  </div>

                  {/* Footer sub-links: Share & Admin controls */}
                  <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1">
                    <button
                      type="button"
                      onClick={() => handleShare(doc)}
                      className="hover:text-[#1e293b] flex items-center gap-1 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>බෙදාගන්න</span>
                    </button>

                    {/* Admin Edit & Delete buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDocument(doc);
                            setEditModalOpen(true);
                          }}
                          className="text-[#92400e] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>සංස්කරණය</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          className="text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ඉවත් කරන්න</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. GOOGLE DRIVE ARCHIVE CALLOUT BANNER */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#92400e] text-xs font-semibold">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Google Drive සදහම් එකතුව</span>
          </div>
          <h3 className="font-serif-monastic text-xl sm:text-2xl font-bold text-[#1e293b]">
            සියලුම PDF ගොනු එකම තැනකින් Google Drive ඔස්සේ ලබාගන්න
          </h3>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-2xl">
            ආරණ්‍ය සේනාසනය මඟින් නිරන්තරයෙන් අලුතින් එක්කරනු ලබන සියලුම සදහම් ග්‍රන්ථ, සූත්‍ර සාකච්ඡා සටහන් සහ පත්‍රිකා එකතුව Google Drive ෆෝල්ඩරය හරහා සෘජුවම නැරඹිය හැක.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={MONASTERY_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Google Drive විවෘත කරන්න</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleDocumentAdded}
      />

      {/* Edit Modal */}
      <DocumentEditModal
        isOpen={editModalOpen}
        document={editingDocument}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        onSave={handleDocumentSaved}
      />

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        document={selectedDocument}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
        }}
      />

      {/* Admin PIN Modal */}
      <AdminPinModal
        isOpen={adminPinModalOpen}
        onClose={() => setAdminPinModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setUploadModalOpen(true);
        }}
        title="පරිපාලක පිවිසුම (Admin PIN)"
        description="දහම් පුස්තකාලයට නව PDF එක් කිරීම හෝ කළමනාකරණය සඳහා කරුණාකර PIN අංකය ඇතුළත් කරන්න."
      />
    </div>
  );
}
