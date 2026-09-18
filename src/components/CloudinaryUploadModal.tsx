"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { GalleryItem } from "@/lib/gallery";

interface CloudinaryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (item: GalleryItem) => void;
}

export default function CloudinaryUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: CloudinaryUploadModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("පිංකම්");
  const [month, setMonth] = useState("2026 සැප්තැම්බර්");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_gallery_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, [isOpen]);

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
      setFile(selected);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) {
      setErrorMessage("කරුණාකර උඩුගත කිරීමට ඡායාරූපයක් තෝරන්න.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    let finalImageUrl = previewUrl || "";

    try {
      if (file) {
        // Upload securely through server upload proxy to Cloudinary
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success || !data.secure_url) {
          throw new Error(
            data.error || "Cloudinary වෙත ඡායාරූපය උඩුගත කිරීම අසාර්ථක විය."
          );
        }
        finalImageUrl = data.secure_url;
      }


      const newItem: GalleryItem = {
        id: "cl-" + Date.now(),
        title: title || "ආරණ්‍ය සේනාසන පිංකම් ඡායාරූපය",
        imageUrl: finalImageUrl,
        category,
        month,
        date: new Date().toISOString().split("T")[0],
        description: description || "කපුගම සුමනවංශ නා හිමි සෙනසුන පුණ්‍ය භූමියේ ඡායාරූපයකි.",
      };

      onUploadSuccess(newItem);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setFile(null);
        setPreviewUrl(null);
        setTitle("");
        setDescription("");
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || "ඡායාරූපය එක්කිරීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] rounded-2xl shadow-2xl border border-[#e6dfd3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Clean Header with NO technical credentials */}
        <div className="bg-[#14532d] text-white px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Upload className="w-5 h-5 text-amber-300 shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-amber-300 shrink-0" />
            )}
            <div>
              <h3 className="font-serif-monastic text-base font-semibold">
                {isAuthenticated
                  ? "පිංකම් ඡායාරූප උඩුගත කිරීම"
                  : "පරිපාලක පිවිසුම"}
              </h3>
              <p className="text-[11px] text-emerald-200">
                කපුගම සුමනවංශ නා හිමි සෙනසුන • පිංකම් ගැලරිය
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PIN AUTHENTICATION FORM IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <form onSubmit={handlePinSubmit} className="p-6 sm:p-8 space-y-5 text-center overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif-monastic font-semibold text-lg text-[#1e293b]">
                සේනාසන පරිපාලක PIN අංකය ඇතුළත් කරන්න
              </h4>
              <p className="text-xs text-[#64748b] max-w-xs mx-auto">
                ඡායාරූප උඩුගත කිරීම සඳහා අනවසර පිවිසුම් වැළැක්වීමට මෙම ආරක්ෂක පියවර එක්කර ඇත.
              </p>
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="max-w-xs mx-auto">
              <input
                type="password"
                maxLength={8}
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full text-center tracking-widest text-xl font-mono font-bold py-3 px-4 rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#14532d] text-[#1e293b]"
              />
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-[#f1ece1] rounded-xl transition-colors"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                disabled={isVerifyingPin}
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#14532d] hover:bg-[#0d3d20] disabled:opacity-60 rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                {isVerifyingPin ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                )}
                <span>තහවුරු කර පිවිසෙන්න</span>
              </button>
            </div>
          </form>
        ) : success ? (
          /* SUCCESS STATE */
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif-monastic text-lg font-semibold text-[#1e293b]">
              ඡායාරූපය සාර්ථකව පිංකම් ගැලරියට එක්විය!
            </h4>
            <p className="text-xs text-[#64748b]">
              තෝරාගත් මාසික ඇල්බමය තුළ ඡායාරූපය දැන් දිස්වනු ඇත.
            </p>
          </div>
        ) : (
          /* STEP 2: AUTHENTICATED UPLOAD FORM */
          <form onSubmit={handleUpload} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* File drop area */}
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
                ඡායාරූපය තෝරන්න (Select Photo) *
              </label>
              <div className="border-2 border-dashed border-[#d97706]/40 hover:border-[#92400e] rounded-xl p-4 text-center bg-[#f8f5ee] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-[#e6dfd3] shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-[#14532d] font-semibold">
                      ඡායාරූපය තෝරාගෙන ඇත (වෙනස් කිරීමට ක්ලික් කරන්න)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-3">
                    <ImageIcon className="w-8 h-8 text-[#92400e]/60" />
                    <span className="text-xs font-medium text-[#334155]">
                      මෙහි ක්ලික් කර ඔබගේ පරිගණකයෙන් හෝ දුරකථනයෙන් ඡායාරූපය තෝරන්න
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      JPG, PNG, WEBP ගොනු සහය දක්වයි
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                ඡායාරූප මාතෘකාව (Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="උදා: කඨින චීවර පූජා මහෝත්සවය..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#14532d] text-[#1e293b]"
              />
            </div>

            {/* Month & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  මාසය (Month)
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#14532d] text-[#1e293b]"
                >
                  <option>2026 සැප්තැම්බර්</option>
                  <option>2026 අගෝස්තු</option>
                  <option>2026 ජූලි</option>
                  <option>2026 ජූනි</option>
                  <option>2026 මැයි</option>
                  <option>2026 අප්‍රේල්</option>
                  <option>2026 වස්සාන කාලය</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  වර්ගය (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#14532d] text-[#1e293b]"
                >
                  <option>පිංකම්</option>
                  <option>පොහෝ දින</option>
                  <option>දානමය පිංකම්</option>
                  <option>සේනාසන සංවර්ධන</option>
                  <option>සේනාසන පරිසරය</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                කෙටි විස්තරයක් (Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="පිංකම පිළිබඳ කෙටි සටහනක්..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#14532d] text-[#1e293b]"
              />
            </div>

            {/* Admin status pill */}
            <div className="text-[11px] text-[#14532d] bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>පරිපාලක පිවිසුම සක්‍රීයයි</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  if (typeof window !== "undefined") {
                    sessionStorage.removeItem("admin_gallery_auth");
                  }
                }}
                className="text-[11px] text-[#92400e] underline hover:no-underline font-medium"
              >
                ඉවත්වන්න (Lock)
              </button>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-[#e6dfd3]">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#475569] hover:bg-[#f1ece1] rounded-xl transition-colors text-center"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#14532d] hover:bg-[#0d3d20] disabled:opacity-60 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>උඩුගත වෙමින් පවතී...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>ගැලරියට එක්කරන්න</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
