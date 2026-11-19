"use client";

import React from "react";
import {
  ExternalLink,
  Share2,
  CheckCircle2,
  Flame,
  Radio,
  Play,
} from "lucide-react";

export default function SocialLinksIsland() {
  const socials = [
    {
      name: "YouTube",
      handle: "@SupasonicBeatsOfficial",
      role: "Official Masters & Playlists",
      url: "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1",
      color: "from-red-600 to-rose-600",
      accent: "text-[#ff0000]",
      borderHover: "hover:border-[#ff0000]",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      handle: "@supasonicbeats",
      role: "Reels & 15s Drop Previews",
      url: "https://www.instagram.com/supasonicbeats",
      color: "from-pink-500 via-purple-500 to-amber-500",
      accent: "text-pink-400",
      borderHover: "hover:border-pink-500/50",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: "TikTok",
      handle: "@supasonicbeats",
      role: "Viral Audio Loops & Drops",
      url: "https://www.tiktok.com/@supasonicbeats",
      color: "from-cyan-400 via-slate-800 to-pink-500",
      accent: "text-cyan-400",
      borderHover: "hover:border-cyan-400/50",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.37 6.37 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.82a8.2 8.2 0 0 0 4.77 1.52V7.89a4.85 4.85 0 0 1-1-.2z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      handle: "Supasonic Beats Official",
      role: "Desi Producer Community",
      url: "https://www.facebook.com/supasonicbeats",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      borderHover: "hover:border-blue-500/50",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  return (
    <section aria-label="Official Social Ecosystem" className="space-y-3.5 my-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#ff0000]" />
            Official Social & Community Hub
          </h2>
          <p className="text-xs text-gray-500">
            Connect with SUPASONIC BEATS across YouTube, Instagram, TikTok & Facebook.
          </p>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
          Official Handles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3.5 rounded-2xl bg-white border border-gray-200 ${s.borderHover} hover:shadow-md transition-all duration-200 group block active:scale-95`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                {s.icon}
              </div>
              <span className="p-1 rounded-lg bg-gray-100 text-gray-500 group-hover:text-black transition-colors">
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>

            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span>{s.name}</span>
              <span className="w-3 h-3 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-[8px] font-black">
                ✓
              </span>
            </div>

            <div className={`text-xs font-medium ${s.accent} mt-0.5`}>
              {s.handle}
            </div>

            <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-1">
              {s.role}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
