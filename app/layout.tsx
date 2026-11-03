import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUPASONIC BEATS | Pro Studio Analytics 2.0",
  description: "Next-gen YouTube Studio Analytics tailored for Music Producers and Beatmakers",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Supasonic Studio",
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export const viewport = {
  themeColor: "#0c0e17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
