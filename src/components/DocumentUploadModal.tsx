"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  DocumentItem,
  DOCUMENT_CATEGORIES,
  MONASTERY_DRIVE_FOLDER_URL,
  extractGoogleDriveId,
  buildGoogleDriveDownloadUrl,
  buildGoogleDrivePreviewUrl,
} from "@/lib/documents";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (item: DocumentItem) => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: DocumentUploadModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Tab: 'google_drive' | 'direct_upload'
  const [activeTab, setActiveTab] = useState<"google_drive" | "direct_upload">("google_drive");

  // Form states
  const [title, setTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES[1] || "සූත්‍ර ධර්ම & අටුවා");
  const [author, setAuthor] = useState("පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ");
  const [description, setDescription] = useState("");
  const [pageCount, setPageCount] = useState<number | "">("");
  const [fileSize, setFileSize] = useState("");

  // Google Drive tab state
  const [driveUrl, setDriveUrl] = useState("");
  const [detectedDriveId, setDetectedDriveId] = useState<string | null>(null);

  // Direct Upload tab state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_gallery_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, [isOpen]);

  // Live extract Google Drive ID
  useEffect(() => {
    if (driveUrl.trim()) {
      const extracted = extractGoogleDriveId(driveUrl.trim());
      setDetectedDriveId(extracted);
    } else {
      setDetectedDriveId(null);
    }
  }, [driveUrl]);

  if (!isOpen) return null;

  // Verify PIN securely on the server
  const handlePinSubmit = async (e: React.FormEvent) => {
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
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_gallery_auth", "true");
        }
      } else {
        setPinError(data.error || "ඇතුළත් කළ PIN අංකය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.");
        setPinInput("");
      }
    } catch (err) {
      setPinError("සත්‍යාපනය කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith(".pdf") && selected.type !== "application/pdf") {
        setErrorMessage("කරුණාකර PDF ගොනුවක් පමණක් තෝරන්න.");
        return;
      }
      setPdfFile(selected);
      setErrorMessage(null);
      // Auto-set title if empty
      if (!title) {
        const cleanName = selected.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
      // Auto-set file size
      const sizeMb = (selected.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("කරුණාකර ලේඛනයේ මාතෘකාව ඇතුළත් කරන්න.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let finalDownloadUrl = "";
      let finalPreviewUrl = "";
      let finalDriveUrl = "";
      let finalFileId: string | undefined = undefined;
      const sourceType = activeTab;

      if (activeTab === "google_drive") {
        if (!driveUrl.trim()) {
          setErrorMessage("කරුණාකර Google Drive සබැඳිය (Link) ඇතුළත් කරන්න.");
          setIsSubmitting(false);
          return;
        }

        const driveId = extractGoogleDriveId(driveUrl.trim());
        finalDriveUrl = driveUrl.trim();
        finalFileId = driveId || undefined;

        if (driveId) {
          finalDownloadUrl = buildGoogleDriveDownloadUrl(driveId);
          finalPreviewUrl = buildGoogleDrivePreviewUrl(driveId);
        } else {
          finalDownloadUrl = driveUrl.trim();
          finalPreviewUrl = driveUrl.trim();
        }
      } else {
        // Direct PDF upload
        if (!pdfFile) {
          setErrorMessage("කරුණාකර උඩුගත කිරීමට PDF ගොනුවක් තෝරන්න.");
          setIsSubmitting(false);
          return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", pdfFile);

        const uploadRes = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        setIsUploading(false);

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "ගොනුව උඩුගත කිරීම අසාර්ථක විය.");
        }

        if (uploadData.isGoogleDrive && uploadData.googleDriveFileId) {
          finalDownloadUrl = uploadData.downloadUrl;
          finalPreviewUrl = uploadData.previewUrl;
          finalDriveUrl = uploadData.googleDriveUrl;
          finalFileId = uploadData.googleDriveFileId;
        } else {
          finalDownloadUrl = uploadData.downloadUrl || uploadData.url;
          finalPreviewUrl = uploadData.previewUrl || uploadData.url;
        }
        if (!fileSize && uploadData.fileSize) {
          setFileSize(uploadData.fileSize);
        }
      }


      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: title.trim(),
        englishTitle: englishTitle.trim() || undefined,
        category,
        author: author.trim() || "කපුගම සුමනවංශ නා හිමි සෙනසුන",
        description:
          description.trim() ||
          "අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ නිර්මල ධර්ම දේශනා හා ශාසනික උපදෙස් ඇතුළත් ලේඛනය.",
        fileSize: fileSize.trim() || (activeTab === "google_drive" ? "PDF" : "3.0 MB"),
        pageCount: pageCount ? Number(pageCount) : undefined,
        publishedDate: new Date().toISOString().split("T")[0],
        googleDriveUrl: finalDriveUrl || undefined,
        googleDriveFileId: finalFileId,
        downloadUrl: finalDownloadUrl,
        previewUrl: finalPreviewUrl,
        sourceType,
        downloadsCount: 1,
      };

      onUploadSuccess(newDoc);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "ලේඛනය එක් කිරීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e6dfd3] bg-[#f8f5ee]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-[#92400e]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-monastic font-bold text-lg text-[#1e293b]">
                නව PDF ලේඛනයක් එක් කරන්න
              </h3>
              <p className="text-xs text-[#64748b]">
                Google Drive සබැඳියක් හෝ සෘජු PDF ගොනුවක් පුස්තකාලයට එක් කරන්න
              </p>
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

        {/* PIN Security Gate if not authenticated */}
        {!isAuthenticated ? (
          <form onSubmit={handlePinSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#92400e] flex items-center justify-center mx-auto border border-amber-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif-monastic font-bold text-base text-[#1e293b]">
                පරිපාලක පිවිසුම අවශ්‍යයි (Admin PIN)
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                දහම් පුස්තකාලයට නව PDF ගොනු එක් කිරීමට කරුණාකර ආරණ්‍ය සේනාසන පරිපාලක PIN අංකය ඇතුළත් කරන්න.
              </p>
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 max-w-sm mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="max-w-xs mx-auto space-y-2">
              <input
                type="password"
                autoFocus
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl border border-[#e6dfd3] bg-white text-center text-lg tracking-widest font-mono text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]/30 focus:border-[#92400e]"
              />
              <button
                type="submit"
                disabled={isVerifyingPin || !pinInput.trim()}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isVerifyingPin ? "තහවුරු කරමින්..." : "තහවුරු කර ඇතුළු වන්න"}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Document Upload Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mode Selection Tabs */}
            <div className="bg-[#f1ece1] p-1 rounded-2xl grid grid-cols-2 gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("google_drive")}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === "google_drive"
                    ? "bg-white text-[#92400e] shadow-sm"
                    : "text-[#475569] hover:text-[#1e293b]"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Google Drive සබැඳිය (නිර්දේශිතයි)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("direct_upload")}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === "direct_upload"
                    ? "bg-white text-[#92400e] shadow-sm"
                    : "text-[#475569] hover:text-[#1e293b]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>සෘජු PDF Upload</span>
              </button>
            </div>

            {/* TAB 1: Google Drive Link Mode */}
            {activeTab === "google_drive" && (
              <div className="space-y-3 bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e6dfd3] pb-3">
                  <div>
                    <span className="text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-amber-700" />
                      <span>විහාරස්ථානයේ නිල Google Drive ෆෝල්ඩරය</span>
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      පොත්පත් සහ ලේඛන ගබඩා කර ඇති Google Drive ෆෝල්ඩරය (PDF web)
                    </p>
                  </div>
                  <a
                    href={MONASTERY_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors shrink-0"
                  >
                    <span>Google Drive විවෘත කරන්න</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1e293b]">
                    Google Drive Shareable Link *
                  </label>
                  <input
                    type="url"
                    required={activeTab === "google_drive"}
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                  />
                  {detectedDriveId ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Drive File ID හඳුනාගැනිණි: <code className="font-mono text-[10px] bg-emerald-50 px-1 py-0.5 rounded">{detectedDriveId.slice(0, 16)}...</code></span>
                    </div>
                  ) : driveUrl.trim() ? (
                    <div className="text-[11px] text-amber-700">
                      සටහන: Google Drive හි Share කර Link එක Copy කර ගන්න.
                    </div>
                  ) : null}
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-[#78350f] space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>Google Drive Link එක ලබාගන්නේ කෙසේද?</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10.5px] leading-relaxed text-[#92400e]">
                    <li>ඉහත බටනයෙන් Google Drive ෆෝල්ඩරය විවෘත කරන්න.</li>
                    <li>අදාළ PDF එක මත Right-click කර <strong>Share &gt; Copy link</strong> තෝරන්න.</li>
                    <li>Access වර්ගය <em>&quot;Anyone with the link can view&quot;</em> ලෙස තබා මෙහි Paste කරන්න.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2: Direct PDF Upload Mode */}
            {activeTab === "direct_upload" && (
              <div className="space-y-3 bg-[#f8f5ee] border border-[#e6dfd3] p-4 rounded-2xl">
                <label className="block text-xs font-semibold text-[#1e293b]">
                  පරිගණකයෙන් / දුරකථනයෙන් PDF එක තෝරන්න *
                </label>
                <div className="relative border-2 border-dashed border-[#d97706]/40 hover:border-[#92400e] bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-amber-100 text-[#92400e] flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    {pdfFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{pdfFile.name}</span>
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          ප්‍රමාණය: {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#1e293b]">
                          PDF ගොනුව මෙතැනට Drag & Drop කරන්න හෝ Click කර තෝරන්න
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          උපරිම ගොනු ප්‍රමාණය: 50MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Common Document Metadata */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    සිංහල මාතෘකාව (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="උදා: සෙත් පිරිත් දේශනා සහ බෝධි පූජා..."
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
                    placeholder="e.g. Seth Pirith Chanting Manual"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    කාණ්ඩය (Category) *
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
                    කර්තෘ / දේශකයන් වහන්සේ (Author)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    පිටු ගණන (Page Count - විකල්ප)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="උදා: 48"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    ගොනුවේ ප්‍රමාණය (File Size - විකල්ප)
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="උදා: 2.5 MB"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  කෙටි විස්තරය (Description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ග්‍රන්ථය හෝ ලේඛනය පිළිබඳ කෙටි පැහැදිලි කිරීමක්..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e6dfd3] bg-white text-xs sm:text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#92400e]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#e6dfd3] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#e6dfd3] text-xs font-semibold text-[#475569] hover:bg-[#f1ece1] transition-colors"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting || isUploading ? "සුරකිමින් පවතී..." : "පුස්තකාලයට එක් කරන්න"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
