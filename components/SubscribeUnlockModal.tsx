"use client";

import React, { useState } from "react";
import { Play, Download, CheckCircle2, X, ExternalLink, Headphones } from "lucide-react";

interface SubscribeUnlockModalProps {
  isOpen: boolean;
  trackTitle: string;
  formatLabel: string;
  downloadUrl: string;
  filename: string;
  onClose: () => void;
}

export default function SubscribeUnlockModal({
  isOpen,
  trackTitle,
  formatLabel,
  downloadUrl,
  filename,
  onClose,
}: SubscribeUnlockModalProps) {
  const [unlocked, setUnlocked] = useState(false);

  if (!isOpen) return null;

  const subscribeUrl = "https://www.youtube.com/@SupasonicBeatsOfficial?sub_confirmation=1";

  const triggerFileDownload = () => {
    const a = document.createElement("a");
    a.href = downloadUrl || "/audio/clover_clip.mp3";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubscribeAndDownload = () => {
    window.open(subscribeUrl, "_blank", "noopener,noreferrer");
    setUnlocked(true);
    setTimeout(() => {
      triggerFileDownload();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] liquid-glass p-6 sm:p-7 space-y-5 shadow-2xl border border-white/95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl liquid-btn-red flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ff3b30]">
                Studio Audio Master
              </p>
              <h3 className="text-base font-bold text-[#0b0f19] line-clamp-1">
                {trackTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full liquid-pill text-slate-600 hover:text-slate-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 border border-white/90 space-y-2 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-center justify-between font-semibold text-[#0b0f19]">
            <span>Format</span>
            <span className="font-mono text-[#ff3b30]">{formatLabel}</span>
          </div>
          <p className="text-slate-600">
            Free for Car USBs, DJ sets, and creator Reels with attribution to{" "}
            <strong className="text-[#0b0f19]">@SupasonicBeatsOfficial</strong>.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleSubscribeAndDownload}
            className="w-full py-3.5 px-5 rounded-full liquid-btn-red font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {unlocked ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Download Started — Thank You</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Subscribe on YouTube &amp; Download</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>

          <button
            onClick={() => {
              triggerFileDownload();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-full liquid-pill text-xs font-medium text-slate-600 hover:text-[#0b0f19] flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Already Subscribed — Download Directly</span>
          </button>
        </div>
      </div>
    </div>
  );
}
