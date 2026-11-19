"use client";

import React, { useEffect, useState } from "react";
import { Download, Monitor, Smartphone, Check, X, Shield, Sparkles } from "lucide-react";

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallPwaModal({ isOpen, onClose }: InstallPwaModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"windows" | "ios" | "android" | "other">("windows");

  useEffect(() => {
    // Detect OS
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else if (/win/.test(ua)) {
      setPlatform("windows");
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      // Direct Chrome / Edge instruction or fallback
      alert(
        platform === "ios"
          ? "Tap the Share button in Safari and choose 'Add to Home Screen'."
          : "To install: In your browser address bar, click the 'Install App' icon (computer with down arrow) on the right!"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[540px] bg-white rounded-[24px] border border-black shadow-2xl overflow-hidden p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="size-12 rounded-2xl bg-[#dd1818] text-white flex items-center justify-center font-black text-xl shadow-md">
            BB
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-black leading-tight">
              Install Bus Buddy App
            </h2>
            <p className="text-xs text-gray-500">Official Thangavelu Travels Web App</p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-3 mb-6 bg-red-50/60 border border-red-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Check className="size-4 text-[#dd1818] shrink-0 mt-0.5" />
            <span className="text-xs text-gray-800 font-medium">
              Runs as a standalone desktop/phone app without browser address bar
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="size-4 text-[#dd1818] shrink-0 mt-0.5" />
            <span className="text-xs text-gray-800 font-medium">
              Faster 1-click access directly from your Desktop, Taskbar, or Home Screen
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="size-4 text-[#dd1818] shrink-0 mt-0.5" />
            <span className="text-xs text-gray-800 font-medium">
              Instant boarding pass viewing & live seat selection offline cache
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isInstalled ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-center text-sm font-bold">
            ✓ App is already installed! You can launch it from your desktop or start menu.
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleInstallClick}
              className="w-full h-[52px] bg-[#dd1818] hover:bg-[#b81212] active:scale-98 text-white border-2 border-black rounded-[14px] font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="size-5" />
              <span>Install App Now</span>
            </button>

            {platform === "windows" && (
              <p className="text-[11px] text-center text-gray-500">
                You can also click the <strong>Install</strong> icon in your browser address bar (top right).
              </p>
            )}

            {platform === "ios" && (
              <p className="text-[11px] text-center text-gray-500">
                On Safari: Tap <strong>Share</strong> (box with arrow) → <strong>Add to Home Screen</strong>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
