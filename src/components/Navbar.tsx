"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Heart, Calendar, Image as ImageIcon, Compass } from "lucide-react";
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

  const navLinks = [
    { name: "මුල් පිටුව", href: "/", icon: Compass },
    { name: "ධර්ම දේශනා & මාධ්‍ය", href: "/media", icon: YoutubeIcon },
    { name: "පොහෝ දින වැඩසටහන්", href: "/calendar", icon: Calendar },
    { name: "පිංකම් (ගැලරිය)", href: "/gallery", icon: ImageIcon },
    { name: "සේනාසන තොරතුරු & සබඳතා", href: "/contact", icon: Phone },
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 sm:py-2.5">
          {/* Logo & Temple Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-[#d97706]/40 p-0.5 bg-[#f8f5ee] shadow-sm group-hover:border-[#92400e] transition-colors">
              <Image
                src="/images/logo.png"
                alt="කපුගම සුමනවංශ නා හිමි සෙනසුන ලාංඡනය"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-[#92400e] font-semibold">
                අරණ්‍ය සේනාසනය • බෙලිඅත්ත
              </span>
              <span className="font-serif-monastic font-semibold text-[#1e293b] text-base sm:text-lg leading-tight group-hover:text-[#92400e] transition-colors">
                කපුගම සුමනවංශ නා හිමි සෙනසුන
              </span>
              <span className="text-[11px] text-[#475569] hidden sm:block">
                පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#92400e] bg-[#ffc2a5]/30 font-semibold"
                      : "text-[#334155] hover:text-[#92400e] hover:bg-[#f1ece1]/70"
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${isActive ? "text-[#92400e]" : "text-[#64748b]"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Dana Sponsor Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setDanaModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-white bg-[#92400e] hover:bg-[#712c00] transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-amber-200" />
              <span>දානමය දායකත්වය</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setDanaModalOpen(true)}
              aria-label="දානමය දායකත්වය"
              className="sm:hidden p-2 rounded-full bg-[#92400e] text-white"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1e293b] hover:bg-[#f1ece1] transition-colors"
              aria-label="මෙනුව විවෘත කරන්න"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e6dfd3] bg-[#fdfbf7] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#92400e] bg-[#ffc2a5]/35 font-semibold"
                        : "text-[#334155] hover:bg-[#f1ece1]"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-[#92400e]" : "text-[#64748b]"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#e6dfd3]/80">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDanaModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#92400e] hover:bg-[#712c00] transition-colors shadow-sm"
                >
                  <Heart className="w-4 h-4 fill-current text-amber-200" />
                  <span>දානමය දායකත්වය වෙන්කරවා ගැනීම</span>
                </button>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCalendarModalOpen(true);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-semibold text-[#92400e] flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>බෞද්ධ දිනදර්ශනය</span>
                  </button>
                  <a
                    href="tel:0701174907"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#f8f5ee] border border-[#e6dfd3] text-xs font-semibold text-[#14532d] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>070 117 4907</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

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
