"use client";

import React, { useState } from "react";
import { User as UserIcon, LogOut, Download, Menu, X, Bus } from "lucide-react";
import { User } from "@/types";

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenInstallModal: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export default function Navbar({
  user,
  onOpenLogin,
  onLogout,
  onOpenInstallModal,
  onNavigateSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 transition-all shadow-sm">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-[72px] md:h-[80px] flex items-center justify-between gap-4">
        {/* Brand Logo - Matching Figma */}
        <div
          onClick={() => scrollTo("hero")}
          className="cursor-pointer flex items-center gap-2 select-none shrink-0"
        >
          <div className="size-9 rounded-xl bg-[#dd1818] flex items-center justify-center text-white shadow-sm">
            <Bus className="size-5" />
          </div>
          <span className="text-[#dd1818] font-black text-2xl sm:text-3xl md:text-[34px] tracking-tight font-serif">
            Bus Buddy
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollTo("hero")}
            className="text-[17px] font-medium text-black hover:text-[#dd1818] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="text-[17px] font-medium text-black hover:text-[#dd1818] transition-colors cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("routes")}
            className="text-[17px] font-medium text-black hover:text-[#dd1818] transition-colors cursor-pointer"
          >
            Tickets
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="text-[17px] font-medium text-black hover:text-[#dd1818] transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right CTA Actions: Install App + Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Install App Button */}
          <button
            onClick={onOpenInstallModal}
            title="Install Bus Buddy as an App"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold border border-gray-300 transition-all cursor-pointer"
          >
            <Download className="size-4 text-[#dd1818]" />
            <span>Install App</span>
          </button>

          {/* User Status or Login Button */}
          {user && user.isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 border border-gray-300 rounded-xl px-3 sm:px-4 py-1.5">
              <div className="size-8 rounded-full bg-[#dd1818] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span className="font-semibold text-xs sm:text-sm text-gray-800 hidden sm:inline">
                {user.mobile}
              </span>
              <button
                onClick={onLogout}
                title="Log out"
                className="text-gray-500 hover:text-red-600 transition-colors p-1 cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white border-2 border-black rounded-[12px] px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
            >
              <UserIcon className="size-4" />
              <span>Login / Account</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-black rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 animate-fade-in shadow-md">
          <button
            onClick={() => scrollTo("hero")}
            className="block w-full text-left py-2 font-bold text-gray-800 hover:text-[#dd1818]"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="block w-full text-left py-2 font-bold text-gray-800 hover:text-[#dd1818]"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("routes")}
            className="block w-full text-left py-2 font-bold text-gray-800 hover:text-[#dd1818]"
          >
            Tickets
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="block w-full text-left py-2 font-bold text-gray-800 hover:text-[#dd1818]"
          >
            About
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInstallModal();
            }}
            className="flex items-center gap-2 w-full text-left py-2 font-bold text-[#dd1818]"
          >
            <Download className="size-4" />
            <span>Install Bus Buddy App</span>
          </button>
        </div>
      )}
    </header>
  );
}
