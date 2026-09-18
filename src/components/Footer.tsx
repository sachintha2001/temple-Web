import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Heart, Clock, ShieldCheck, Mail } from "lucide-react";
import YoutubeIcon from "@/components/YoutubeIcon";

export default function Footer() {
  return (
    <footer className="bg-[#14532d] text-[#f8f5ee] border-t border-[#d97706]/30">
      {/* Decorative Golden Top Line */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Monastery Overview & Insignia */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/80 bg-[#f8f5ee] p-0.5 shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="කපුගම සුමනවංශ නා හිමි සෙනසුන ලාංඡනය"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif-monastic font-semibold text-lg text-amber-200 leading-snug">
                  කපුගම සුමනවංශ නා හිමි සෙනසුන
                </h3>
                <p className="text-xs text-emerald-200">අරණ්‍ය සේනාසනය • බෙලිඅත්ත</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              සම්බුදු සසුනේ චිරස්ථිතිය උදෙසාත්, නිර්මල ථේරවාදී ධර්ම මාර්ගය ඔස්සේ චිත්ත සමාධිය වඩාගැනීම පිණිසත් ආරණ්‍යක භික්ෂූන් වහන්සේලා වැඩවසන පින්බිම.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <span>ප්‍රධාන අනුශාසක:</span>
              <span className="text-white font-semibold">පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif-monastic text-base font-semibold text-amber-300 border-b border-emerald-800 pb-2">
              ප්‍රධාන පිටු
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • මුල් පිටුව (Home)
                </Link>
              </li>
              <li>
                <Link href="/meheni-aramaya" className="text-amber-300 font-semibold hover:text-white transition-colors">
                  • කපුගම සීලවංශ මෙහෙණි ආරාමය
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • ධර්ම දේශනා & YouTube මාධ්‍ය
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • දහම් පුස්තකාලය & PDF
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • පොහෝ දින වැඩසටහන් & දිනදර්ශනය
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • පිංකම් ගැලරිය (Pin Kam)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-emerald-100/80 hover:text-amber-200 transition-colors">
                  • සේනාසන තොරතුරු & සබඳතා
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Visiting Hours */}
          <div className="space-y-4">
            <h4 className="font-serif-monastic text-base font-semibold text-amber-300 border-b border-emerald-800 pb-2">
              සම්බන්ධීකරණය & පිහිටීම
            </h4>
            <div className="space-y-3 text-sm text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed">
                  කපුගම සුමනවංශ සෙනසුන & සීලවංශ මෙහෙණි ආරාමය,<br />
                  මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="tel:0701174907"
                  className="font-medium text-amber-200 hover:underline text-sm"
                >
                  070 117 4907
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:samahithathero3@gmail.com"
                  className="font-medium text-amber-200 hover:underline text-xs"
                >
                  samahithathero3@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200">
                  <p>දානමය වේලාවන්: පෙ.ව. 10:30 - ප.ව. 12:30</p>
                  <p>බැහැදැකීමේ වේලාවන්: ප.ව. 03:00 - 05:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Noble Verse & YouTube */}
          <div className="space-y-4">
            <h4 className="font-serif-monastic text-base font-semibold text-amber-300 border-b border-emerald-800 pb-2">
              සදහම් පණිවිඩය
            </h4>
            <blockquote className="italic text-xs sm:text-sm text-emerald-100/90 bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800/80">
              &quot;නත්ථි සන්ති පරං සුඛං&quot;<br />
              <span className="text-[11px] text-amber-200 not-italic block mt-1">
                ශාන්තියට වඩා උතුම් වූ සැපයක් තවත් නැත. සිත සන්සුන් කරගනිමින් නිවන් මග වඩාගනිමු.
              </span>
            </blockquote>
            <div className="pt-1">
              <a
                href="https://www.youtube.com/@nirmalabududahama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-700/80 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>නිල YouTube නාලිකාව</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <p>© {new Date().getFullYear()} කපුගම සුමනවංශ නා හිමි සෙනසුන (අරණ්‍ය සේනාසනය). සියලු හිමිකම් ඇවිරිණි.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>පූජ්‍ය දික්කුඹුරේ සුභූති හිමි</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
