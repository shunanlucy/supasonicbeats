import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://supasonicbeats.com"),
  title: {
    default: "SUPASONIC BEATS™ | Free Hindi Afro House & Desi EDM Beats (320kbps MP3 & WAV)",
    template: "%s | SUPASONIC BEATS™",
  },
  description:
    "Stream and download high-energy Hindi Afro House, Desi Deep House, and Bollywood club banger beats at 124 BPM by SUPASONIC BEATS. Free 320kbps MP3s, studio WAV master stems, viral sound tags, and royalty-friendly DJ club mixes.",
  keywords: [
    "Hindi Afro House",
    "Desi EDM",
    "Bollywood Afro House 2026",
    "124 BPM Club Beats",
    "Desi Deep House Beats",
    "Supasonic Beats",
    "Free Beat Download 320kbps",
    "Studio WAV Stems",
    "Indian Club Bangers",
    "Hindi Dance Music Instrumental",
    "Afro Desi Fusion",
    "Royalty Free Indian Beats",
    "DJ Club Remix Beats",
    "Bollywood Dance Beats",
    "Late Night Drive Beats",
    "Desi Electronic Music",
    "Singularity Beats Competitor",
    "Dhun Music Vibes Style",
    "Hindi Club Master Stems",
  ],
  authors: [{ name: "SUPASONIC BEATS", url: "https://www.youtube.com/@SupasonicBeatsOfficial" }],
  creator: "SUPASONIC BEATS",
  publisher: "SUPASONIC BEATS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://supasonicbeats.com",
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: ["en_US"],
    url: "https://supasonicbeats.com",
    siteName: "SUPASONIC BEATS Official Portal",
    title: "SUPASONIC BEATS™ | Official Hindi Afro House & Desi EDM Beats",
    description:
      "Exclusive 124 BPM Hindi Afro House, Desi EDM, and club banger beats. Free 320kbps MP3 audio, lossless studio WAV stems, and 4K cover artwork.",
    images: [
      {
        url: "/channel_banner.jpg",
        width: 1200,
        height: 630,
        alt: "SUPASONIC BEATS Studio Banner",
      },
      {
        url: "/channel_avatar.jpg",
        width: 800,
        height: 800,
        alt: "SUPASONIC BEATS Official Avatar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SUPASONIC BEATS™ | Free Hindi Afro House Beats (320kbps MP3 & WAV)",
    description:
      "Trending Hindi Afro House & Desi EDM beats produced by SUPASONIC BEATS. Stream free, download stems & explore viral YouTube sound tags.",
    images: ["/channel_banner.jpg"],
    creator: "@supasonicbeats",
    site: "@supasonicbeats",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "music",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SUPASONIC BEATS",
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export const viewport = {
  themeColor: "#ff0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Organization & MusicGroup JSON-LD Schema for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://supasonicbeats.com/#website",
        "url": "https://supasonicbeats.com",
        "name": "SUPASONIC BEATS Official Music Portal",
        "description": "High Energy Hindi Afro House & Desi EDM Music Hub",
        "inLanguage": "hi-IN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://supasonicbeats.com/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "MusicGroup",
        "@id": "https://supasonicbeats.com/#artist",
        "name": "SUPASONIC BEATS",
        "url": "https://supasonicbeats.com",
        "image": "https://supasonicbeats.com/channel_avatar.jpg",
        "description": "Music Producer specializing in Hindi Afro House, Desi Deep House & Club Beats.",
        "genre": [
          "Hindi Afro House",
          "Desi EDM",
          "Bollywood Afro House",
          "Indian Club Beats",
        ],
        "sameAs": [
          "https://www.youtube.com/@SupasonicBeatsOfficial",
          "https://www.instagram.com/supasonicbeats",
          "https://www.tiktok.com/@supasonicbeats",
          "https://www.facebook.com/supasonicbeats",
        ],
      },
    ],
  };

  return (
    <html lang="hi" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8f9fa] text-[#0f0f0f] antialiased selection:bg-[#ff0000] selection:text-white">
        {children}
      </body>
    </html>
  );
}
