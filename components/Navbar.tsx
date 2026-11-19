"use client";

import React from "react";
import { User as UserIcon, LogOut, Ticket } from "lucide-react";
import { User } from "@/types";

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export default function Navbar({
  user,
  onOpenLogin,
  onLogout,
  onNavigateSection,
}: NavbarProps) {
  const scrollTo = (id: string) => {
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
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1512px] mx-auto px-6 h-[80px] flex items-center justify-between">
        {/* Brand Logo - Exact Figma style */}
        <div
          onClick={() => scrollTo("hero")}
          className="cursor-pointer flex items-center gap-2 select-none"
        >
          <span className="text-[#dd1818] font-black text-[36px] tracking-tight font-serif">
            Bus Buddy
          </span>
        </div>

        {/* Navigation Links - Matching Figma "Home", "Services", "Tickets", "About" */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            onClick={() => scrollTo("hero")}
            className="text-[20px] font-medium text-black hover:text-[#dd1818] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="text-[20px] font-medium text-black hover:text-[#dd1818] transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("routes")}
            className="text-[20px] font-medium text-black hover:text-[#dd1818] transition-colors"
          >
            Tickets
          </button>
          <button
            onClick={() => scrollTo("services")}
            className="text-[20px] font-medium text-black hover:text-[#dd1818] transition-colors"
          >
            About
          </button>
        </nav>

        {/* Login / User Status Button - Exact Figma button styling */}
        <div className="flex items-center gap-3">
          {user && user.isLoggedIn ? (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-1.5">
              <div className="size-8 rounded-full bg-[#dd1818] text-white flex items-center justify-center font-bold text-sm">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span className="font-medium text-sm text-gray-800">
                {user.mobile}
              </span>
              <button
                onClick={onLogout}
                title="Log out"
                className="text-gray-500 hover:text-red-600 transition-colors p-1"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white border-2 border-black rounded-[12px] px-5 py-2 text-[15px] font-bold tracking-wide transition-all shadow-sm flex items-center gap-2"
            >
              <UserIcon className="size-4" />
              <span>Login / Create Account</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
