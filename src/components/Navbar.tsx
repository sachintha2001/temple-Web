"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Heart, Calendar, Image as ImageIcon, Compass, BookOpen, Flower2 } from "lucide-react";
import YoutubeIcon from "./YoutubeIcon";
import DanaBookingModal from "./DanaBookingModal";
import SriLankaClock from "./SriLankaClock";
import InteractiveBuddhistCalendar from "./InteractiveBuddhistCalendar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [danaModalOpen, setDanaModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Close menu when route changes
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "මුල් පිටුව", href: "/", icon: Compass },
    { name: "මෙහෙණි ආරාමය", href: "/meheni-aramaya", icon: Flower2 },
    { name: "ධර්ම දේශනා & මාධ්‍ය", href: "/media", icon: YoutubeIcon },
    { name: "දහම් පුස්තකාලය (PDF)", href: "/publications", icon: BookOpen },
    { name: "පොහෝ දින වැඩසටහන්", href: "/calendar", icon: Calendar },
    { name: "පිංකම් (ගැලරිය)", href: "/gallery", icon: ImageIcon },
    { name: "සේනාසන තොරතුරු", href: "/contact", icon: Phone },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "glass-header shadow-sm"
            : "bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e6dfd3]/80"
        }`}
      >
        {/* Real-time Sri Lanka Digital Clock Bar */}
        <SriLankaClock onOpenCalendar={() => setCalendarModalOpen(true)} />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between py-2 sm:py-2.5">
          {/* Logo & Temple Title */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 pr-2">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#d97706]/40 p-0.5 bg-[#f8f5ee] shadow-sm shrink-0 group-hover:border-[#92400e] transition-colors">
              <Image
                src="/images/logo.png"
                alt="කපුගම සුමනවංශ නා හිමි සෙනසුන ලාංඡනය"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#92400e] font-semibold truncate">
                අරණ්‍ය සේනාසනය • බෙලිඅත්ත
              </span>
              <span className="font-serif-monastic font-semibold text-[#1e293b] text-sm sm:text-lg leading-tight group-hover:text-[#92400e] transition-colors truncate">
                කපුගම සුමනවංශ නා හිමි සෙනසුන
              </span>
              <span className="text-[11px] text-[#475569] hidden sm:block truncate">
                පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1 xl:gap-1.5 shrink-0 ${
                    isActive
                      ? "text-[#92400e] bg-[#ffc2a5]/30 font-semibold"
                      : "text-[#334155] hover:text-[#92400e] hover:bg-[#f1ece1]/70"
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? "text-[#92400e]" : "text-[#64748b]"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Dana Sponsor Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDanaModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-white bg-[#92400e] hover:bg-[#712c00] transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-amber-200" />
              <span>දානමය දායකත්වය</span>
            </button>
          </div>

          {/* Mobile menu triggers */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setDanaModalOpen(true)}
              aria-label="දානමය දායකත්වය"
              className="sm:hidden p-2.5 rounded-xl bg-[#92400e] text-white active:scale-95 transition-transform cursor-pointer touch-manipulation shadow-xs flex items-center justify-center"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-xl text-[#1e293b] hover:text-[#92400e] bg-[#f8f5ee] hover:bg-[#f1ece1] active:bg-[#ffc2a5]/30 border border-[#e6dfd3] active:scale-95 transition-all cursor-pointer touch-manipulation flex items-center justify-center shadow-xs"
              aria-label={mobileMenuOpen ? "මෙනුව වසන්න" : "මෙනුව විවෘත කරන්න"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#92400e]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1e293b]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-in Side Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm bg-[#fdfbf7] border-l border-[#e6dfd3] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="ප්‍රධාන මෙනුව"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e6dfd3] flex items-center justify-between bg-[#f8f5ee]/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#d97706]/40 p-0.5 bg-white shrink-0 shadow-xs">
              <Image
                src="/images/logo.png"
                alt="ලාංඡනය"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif-monastic font-bold text-[#1e293b] text-sm leading-tight truncate">
                කපුගම සුමනවංශ සෙනසුන
              </span>
              <span className="text-[10px] text-[#92400e] font-semibold truncate">
                පූජ්‍ය දික්කුඹුරේ සුභූති හිමි
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-[#64748b] hover:text-[#92400e] hover:bg-[#e6dfd3]/60 active:scale-95 transition-all cursor-pointer touch-manipulation"
            aria-label="මෙනුව වසන්න"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="text-[11px] font-bold text-[#92400e] uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
            <span>ප්‍රධාන මෙනුව</span>
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#92400e] bg-[#ffc2a5]/40 font-bold shadow-xs border border-[#92400e]/20"
                    : "text-[#334155] hover:bg-[#f1ece1] active:bg-[#f1ece1]"
                }`}
              >
                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#92400e]" : "text-[#64748b]"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Quick Action CTAs */}
          <div className="pt-4 border-t border-[#e6dfd3] mt-4 space-y-2.5">
            <div className="text-[11px] font-bold text-[#14532d] uppercase tracking-wider px-3 mb-1">
              පුන්‍යකටයුතු & සබඳතා
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setDanaModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] active:scale-98 transition-all shadow-sm cursor-pointer touch-manipulation"
            >
              <Heart className="w-4 h-4 fill-current text-amber-200" />
              <span>දානමය දායකත්වය වෙන්කරන්න</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCalendarModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-semibold text-[#92400e] active:scale-98 transition-all cursor-pointer touch-manipulation"
            >
              <Calendar className="w-4 h-4 text-[#92400e]" />
              <span>බෞද්ධ පෝදා දිනදර්ශනය</span>
            </button>

            <a
              href="tel:0701174907"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f8f5ee] hover:bg-[#f1ece1] border border-[#e6dfd3] text-xs font-semibold text-[#14532d] active:scale-98 transition-all cursor-pointer touch-manipulation"
            >
              <Phone className="w-4 h-4 text-[#14532d]" />
              <span>අමතන්න: 070 117 4907</span>
            </a>
          </div>
        </div>

        {/* Drawer Monastic Footer */}
        <div className="p-3.5 border-t border-[#e6dfd3] bg-[#f8f5ee]/60 text-center text-xs text-[#64748b] shrink-0">
          <p className="font-serif-monastic text-[#92400e] font-semibold text-xs">
            කපුගම සුමනවංශ සෙනසුන & සීලවංශ මෙහෙණි ආරාමය
          </p>
          <p className="text-[11px] text-[#64748b] mt-0.5">
            ආරණ්‍ය සේනාසනය හා මෙහෙණි සෙවණ • මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත
          </p>
        </div>
      </aside>

      {/* Dana Booking Modal */}
      <DanaBookingModal
        isOpen={danaModalOpen}
        onClose={() => setDanaModalOpen(false)}
      />

      {/* Interactive Buddhist Calendar Modal */}
      <InteractiveBuddhistCalendar
        isModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onOpenDanaBooking={(poya) => {
          setCalendarModalOpen(false);
          setDanaModalOpen(true);
        }}
      />
    </>
  );
}
