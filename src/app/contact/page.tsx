"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Navigation,
  Sparkles,
  Mail,
} from "lucide-react";
import DanaBookingModal from "@/components/DanaBookingModal";

export default function ContactPage() {
  const [danaModalOpen, setDanaModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, type: "General Inquiry" }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffc2a5]/40 text-[#92400e] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
          <span>ශ්‍රී කල්‍යාණී යෝගාශ්‍රම සංස්ථානුබද්ධ ආරණ්‍ය සේනාසනය</span>
        </div>

        <h1 className="font-serif-monastic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e293b] leading-tight">
          සේනාසන තොරතුරු සහ සම්බන්ධීකරණය
        </h1>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          සිත සන්සුන් කරවන සොඳුරු වන ලැහැබක, පිරිසිදු ථේරවාදී ප්‍රතිපත්ති පූජාවන්ට සහ වනගත විවේකී භාවනා දිවියට මුල්තැන දෙමින් පිහිටි කපුගම සුමනවංශ නා හිමි ආරණ්‍ය සේනාසනය.
        </p>
      </div>

      {/* 2. CHIEF MONK PROFILE CARD */}
      <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Portrait with outer halo */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-[#d97706] shadow-xl p-1 bg-white">
              <Image
                src="/images/logo.png"
                alt="පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400e] block">
              ප්‍රධාන අනුශාසක පදවිය
            </span>
            <h2 className="font-serif-monastic text-2xl sm:text-3xl font-bold text-[#1e293b]">
              අතිපූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14532d]/10 text-[#14532d] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ආරණ්‍යවාසී ප්‍රධාන කම්මට්ඨානාචාර්ය • විදර්ශනා හා සතිපට්ඨාන භාවනා ගුරුදේව</span>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              සම්බුදු දේශනාවෙහි නිරවුල් ප්‍රායෝගික හරය සැදැහැවත් ජනතාව වෙත දේශනා කරමින්, නාමරූප විදර්ශනාව හා සතිපට්ඨාන භාවනා ක්‍රමය තුළින් චිත්ත සමාධිය වඩාගැනීමට උපදෙස් ලබාදෙන පින්බර සඟ පියවරුන් වහන්සේ නමකි.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="tel:0701174907"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#92400e] hover:bg-[#712c00] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>සෘජු ඇමතුම්: 070 117 4907</span>
              </a>
              <button
                onClick={() => setDanaModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#f1ece1] border border-[#e6dfd3] text-[#14532d] text-xs sm:text-sm font-semibold transition-colors"
              >
                <Heart className="w-4 h-4 fill-current text-[#14532d]" />
                <span>දානමය දායකත්වයක් වෙන්කරන්න</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTACT DETAILS & ROUTE GUIDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif-monastic text-lg font-semibold text-[#1e293b] border-b border-[#e6dfd3] pb-2">
              සේනාසන කාර්යාලය හා සබඳතා
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#92400e]/10 text-[#92400e] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748b] block">පිහිටීම / ලිපිනය:</span>
                <p className="text-sm font-medium text-[#1e293b] mt-0.5">
                  කපුගම සුමනවංශ නා හිමි සෙනසුන,<br />
                  මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත.
                </p>
                <span className="text-xs text-[#14532d] font-semibold mt-1 block">
                  දකුණු පළාත, ශ්‍රී ලංකාව
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#14532d]/10 text-[#14532d] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748b] block">දුරකථන සම්බන්ධීකරණය:</span>
                <a
                  href="tel:0701174907"
                  className="text-base font-bold text-[#92400e] hover:underline mt-0.5 block"
                >
                  070 117 4907
                </a>
                <span className="text-[11px] text-[#64748b]">
                  පින්කම් හා දානමය විමසීම් සඳහා සක්‍රීයයි
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-700 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748b] block">විද්‍යුත් තැපෑල (Email):</span>
                <a
                  href="mailto:samahithathero3@gmail.com"
                  className="text-sm font-bold text-[#92400e] hover:underline mt-0.5 block break-all"
                >
                  samahithathero3@gmail.com
                </a>
                <span className="text-[11px] text-[#64748b]">
                  පණිවිඩ සහ නිල විමසීම් සඳහා
                </span>
              </div>
            </div>

            {/* Visiting Hours */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748b] block">පැමිණිය හැකි වේලාවන්:</span>
                <div className="text-xs text-[#1e293b] mt-1 space-y-1">
                  <p>• දානමය වේලාවන්: පෙ.ව. 10.30 - ප.ව. 12.30</p>
                  <p>• බැහැදැකීම හා ධර්ම සාකච්ඡා: ප.ව. 03.00 - 05.00</p>
                  <p className="text-[11px] text-[#92400e] font-semibold">
                    * භාවනා වේලාවන්හිදී සෙනසුන් භූමිය තුළ නිහඬතාව රැකගන්න.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Access / Driving Route */}
          <div className="bg-[#f8f5ee] border border-[#e6dfd3] rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#14532d]">
              <Navigation className="w-4 h-4" />
              <span>ප්‍රවේශ මාර්ග උපදෙස්</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              දක්ෂිණ අධිවේගී මාර්ගයේ බෙලිඅත්ත පිවිසුමෙන් පිටවී බෙලිඅත්ත නගරය හරහා සිටිනමලුව දෙසට කිලෝමීටර් 3.5ක් පමණ පැමිණ මල්ගහ කොරටුව හන්දියෙන් ආරණ්‍ය සේනාසන ප්‍රවේශ මාවත වෙත ළඟාවිය හැක.
            </p>
          </div>
        </div>

        {/* Right: Embedded Map & Inquiry Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Frame */}
          <div className="rounded-2xl overflow-hidden border border-[#e6dfd3] shadow-sm bg-slate-100 h-64 sm:h-72 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15870.771239088523!2d80.709!3d6.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1435222444365%3A0x676ff3bc079e0000!2sBeliatta!5e0!3m2!1sen!2slk!4v1710000000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Monastery Location Map"
            />
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#e6dfd3] text-[11px] font-medium text-[#1e293b]">
              📍 මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත
            </div>
          </div>

          {/* Inquiry message form */}
          <div className="bg-[#fdfbf7] border border-[#e6dfd3] rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-monastic text-base font-semibold text-[#1e293b] mb-1">
              සේනාසනය වෙත පණිවිඩයක් යොමු කරන්න
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              පින්කම් සහ සේනාසන තොරතුරු පිළිබඳ විමසීම් සඳහා පහත පෝරමය භාවිතා කරන්න. පණිවිඩය සෘජුවම <strong>samahithathero3@gmail.com</strong> වෙත යොමු කෙරේ.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#f8f5ee] border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif-monastic text-lg font-semibold text-[#1e293b]">
                  ඔබගේ පණිවිඩය සාර්ථකව භාරගන්නා ලදී!
                </h4>
                <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                  මෙම පණිවිඩය සේනාසන කාර්යාලයේ <strong>samahithathero3@gmail.com</strong> විද්‍යුත් තැපෑල වෙත යොමු කර ඇත. සේනාසන කාර්යාලයෙන් හැකි ඉක්මනින් ඔබ අමතනු ඇත.
                </p>

                {/* Direct Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`mailto:samahithathero3@gmail.com?subject=${encodeURIComponent(
                      `[කපුගම සුමනවංශ සෙනසුන] ${contactForm.subject || "විමසීමක්"}`
                    )}&body=${encodeURIComponent(
                      `නම: ${contactForm.name}\nදුරකථනය: ${contactForm.phone}\nකරුණ: ${contactForm.subject}\n\nපණිවිඩය:\n${contactForm.message}`
                    )}`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#0d3d20] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>Gmail හෝ Email යෙදුමෙන් සෘජුව යවන්න</span>
                  </a>

                  <a
                    href={`https://wa.me/94701174907?text=${encodeURIComponent(
                      `*කපුගම සුමනවංශ සෙනසුන වෙත පණිවිඩයක්:*\n\nනම: ${contactForm.name}\nදුරකථනය: ${contactForm.phone}\nකරුණ: ${contactForm.subject}\n\n${contactForm.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>WhatsApp (070 117 4907) මඟින් යවන්න</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setContactForm({ name: "", phone: "", subject: "", message: "" });
                    }}
                    className="text-xs text-[#92400e] font-semibold underline"
                  >
                    නැවත නව පණිවිඩයක් ලියන්න
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                      ඔබගේ නම *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="නම..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                      දුරකථන අංකය *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="07X XXX XXXX"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    විමසීමට අදාළ කරුණ
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="දානමය දායකත්වයන්, භාවනා වැඩසටහන්..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    පණිවිඩය *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="ඔබගේ විමසීම සටහන් කරන්න..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#e6dfd3] bg-[#f8f5ee] focus:outline-none focus:ring-2 focus:ring-[#92400e] text-[#1e293b]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-sm text-xs sm:text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>පණිවිඩය යොමු කරන්න</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Dana Modal */}
      <DanaBookingModal
        isOpen={danaModalOpen}
        onClose={() => setDanaModalOpen(false)}
      />
    </div>
  );
}
