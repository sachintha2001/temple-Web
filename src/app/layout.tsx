import type { Metadata, Viewport } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#92400e",
};

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kapugama-sumanawansa.lk"),
  title: "කපුගම සුමනවංශ නා හිමි සෙනසුන (අරණ්‍ය සේනාසනය) | බෙලිඅත්ත",
  description:
    "කපුගම සුමනවංශ නා හිමි සෙනසුන, මල්ගහ කොරටුව, සිටිනමලුව, බෙලිඅත්ත. ප්‍රධාන අනුශාසක පූජ්‍ය දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේගේ සදහම් දේශනා, පොහෝ දින ශීල භාවනා සහ දානමය පුණ්‍ය කටයුතු.",
  keywords: [
    "කපුගම සුමනවංශ",
    "දික්කුඹුරේ සුභූති ස්වාමීන් වහන්සේ",
    "අරණ්‍ය සේනාසනය",
    "බෙලිඅත්ත සෙනසුන",
    "නිර්මල බුදු දහම",
    "ධර්ම දේශනා",
    "Dana booking",
    "Buddhist monastery Sri Lanka",
  ],
  authors: [{ name: "කපුගම සුමනවංශ නා හිමි සෙනසුන" }],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "කපුගම සුමනවංශ නා හිමි සෙනසුන | අරණ්‍ය සේනාසනය",
    description:
      "ශාන්ත සිතින් නිර්මල බුදු දහම ප්‍රගුණ කරන ආරණ්‍ය සෙනසුන. බෙලිඅත්ත, මල්ගහ කොරටුව.",
    images: ["/images/logo.png"],
    type: "website",
  },
};

import ChatWidget from "@/components/Chatbot/ChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="si"
      suppressHydrationWarning
      className={`${notoSerif.variable} ${plusJakartaSans.variable} scroll-smooth h-full`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;500;600;700&family=Noto+Sans+Sinhala:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#fdfbf7] text-[#1e293b] antialiased selection:bg-[#ffc2a5] selection:text-[#712c00]"
      >
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
